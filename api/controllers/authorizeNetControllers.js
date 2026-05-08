const APIContracts = require('authorizenet').APIContracts;
const APIControllers = require('authorizenet').APIControllers;
const SDKConstants = require('authorizenet').Constants;
const { handleAnglerCase, handleSponsorCase } = require('./registrationControllers');

const isProduction = () => process.env.AUTHORIZE_NET_ENVIRONMENT === 'production';

const getMerchantAuth = () => {
  const merchantAuth = new APIContracts.MerchantAuthenticationType();
  merchantAuth.setName(
    isProduction()
      ? process.env.AUTHORIZE_NET_API_LOGIN_ID_PRODUCTION
      : process.env.AUTHORIZE_NET_API_LOGIN_ID_STAGING
  );
  merchantAuth.setTransactionKey(
    isProduction()
      ? process.env.AUTHORIZE_NET_TRANSACTION_KEY_PRODUCTION
      : process.env.AUTHORIZE_NET_TRANSACTION_KEY_STAGING
  );
  return merchantAuth;
};

exports.authorizeNetCharge = (req, res) => {
  console.log('In api/authorize_net_charge...');

  try {
    const { metadata, opaqueData } = req.body;

    if (!metadata || !opaqueData) {
      return res.status(400).json({ success: false, message: 'Missing metadata or payment token.' });
    }

    const amount = metadata.totalFee ?? metadata.registrationFee;
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ success: false, message: 'Invalid or missing payment amount.' });
    }

    const opaqueDataObj = new APIContracts.OpaqueDataType();
    opaqueDataObj.setDataDescriptor(opaqueData.dataDescriptor);
    opaqueDataObj.setDataValue(opaqueData.dataValue);

    const paymentType = new APIContracts.PaymentType();
    paymentType.setOpaqueData(opaqueDataObj);

    const transactionRequest = new APIContracts.TransactionRequestType();
    transactionRequest.setTransactionType(APIContracts.TransactionTypeEnum.authCaptureTransaction);
    transactionRequest.setAmount(Number(amount).toFixed(2));
    transactionRequest.setPayment(paymentType);

    if (metadata.email) {
      const customer = new APIContracts.CustomerDataType();
      customer.setEmail(metadata.email);
      transactionRequest.setCustomer(customer);
    }

    const createRequest = new APIContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(getMerchantAuth());
    createRequest.setTransactionRequest(transactionRequest);

    const controller = new APIControllers.CreateTransactionController(createRequest.getJSON());
    controller.setEnvironment(
      isProduction() ? SDKConstants.endpoint.production : SDKConstants.endpoint.sandbox
    );

    controller.execute(() => {
      try {
        const apiResponse = controller.getResponse();
        const response = new APIContracts.CreateTransactionResponse(apiResponse);

        if (!response) {
          return res.status(500).json({ success: false, message: 'No response from Authorize.net.' });
        }

        const resultCode = response.getMessages()?.getResultCode();

        if (resultCode === APIContracts.MessageTypeEnum.Ok) {
          const tResponse = response.getTransactionResponse();

          if (tResponse?.getMessages()) {
            const transactionId = tResponse.getTransId();
            console.log(`Authorize.net charge approved. Transaction ID: ${transactionId}`);

            const paymentEventData = {
              customer_details: {
                email: metadata.email || null,
                phone: metadata.phone || null,
              },
              payment_status: 'paid',
              authorize_net_transaction_id: transactionId,
            };

            const handler = metadata.type === 'angler' ? handleAnglerCase : handleSponsorCase;
            handler(metadata, paymentEventData)
              .then(() => res.json({ success: true, transactionId }))
              .catch(err => {
                console.error('Firebase write error after successful charge:', err);
                res.status(500).json({
                  success: false,
                  message: 'Payment succeeded but registration record failed. Please contact support.',
                  transactionId,
                });
              });

          } else {
            const errorText = tResponse?.getErrors()?.getError()?.[0]?.getErrorText() ?? 'Card declined';
            console.warn('Authorize.net transaction declined:', errorText);
            res.status(400).json({ success: false, message: errorText });
          }

        } else {
          const errorText = response.getMessages()?.getMessage()?.[0]?.getText() ?? 'Transaction failed';
          console.warn('Authorize.net API error:', errorText);
          res.status(400).json({ success: false, message: errorText });
        }

      } catch (err) {
        console.error('Error processing Authorize.net response:', err);
        res.status(500).json({ success: false, message: 'Internal error processing payment response.' });
      }
    });

  } catch (err) {
    console.error('Error setting up Authorize.net charge:', err);
    res.status(500).json({ success: false, message: 'Internal error initializing payment.' });
  }
};
