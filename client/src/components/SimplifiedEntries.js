import React, { useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import _ from 'lodash';

function SimplifiedEntries({
  registeredTeamNameList,
  registeredAnglerNameList,
  potEntryData,
  config,
  teamNameListIsLoaded,
  anglerNameListIsLoaded
}) {
  const [selectedParticipant, setSelectedParticipant] = useState('');

  const allParticipants = [
    { group: 'Teams', options: registeredTeamNameList.map(team => ({ 
      id: `team-${team.label}`,
      name: team.label, 
      type: 'team'
    }))},
    { group: 'Anglers', options: registeredAnglerNameList.map(angler => ({
      id: `angler-${angler.label}`,
      name: angler.label,
      type: 'angler'
    }))}
  ];

  const getParticipantInfo = () => {
    if (!selectedParticipant || !potEntryData) return null;

    const allEntries = potEntryData.filter(entry => 
      entry.name === selectedParticipant.name
    );

    if (allEntries.length === 0) return null;

    // Combine all board selections from all entries
    const allBoardSelections = allEntries.flatMap(entry => 
      entry.boardSelections || []
    );

    // Get unique boards and their pots
    const boardsWithPots = _.uniqBy(allBoardSelections, 'board').map(board => ({
      boardName: board.board,
      pots: board.potList.sort()
    }));

    // Get all unique pots across all boards
    const allPots = _.uniq(allBoardSelections.flatMap(board => board.potList)).sort();

    return {
      name: selectedParticipant.name,
      boards: boardsWithPots,
      allPots: allPots
    };
  };

  if (!teamNameListIsLoaded || !anglerNameListIsLoaded) {
    return <CircularProgress />;
  }

  const participantInfo = getParticipantInfo();

  return (
    <div>
      <br/>
      <Select
        value={selectedParticipant ? `${selectedParticipant.type}-${selectedParticipant.name}` : ''}
        onChange={(e) => {
          const [type, ...nameParts] = e.target.value.split('-');
          const name = nameParts.join('-');
          const group = type === 'team' ? allParticipants[0] : allParticipants[1];
          const participant = group.options.find(p => p.name === name);
          setSelectedParticipant(participant);
        }}
        displayEmpty
        fullWidth
        sx={{ maxWidth: '400px' }}
      >
        <MenuItem value="">
          <em>Select Team or Angler</em>
        </MenuItem>
        {allParticipants.map((group) => [
          <MenuItem key={group.group} disabled>
            {group.group}
          </MenuItem>,
          ...group.options.map((participant) => (
            <MenuItem 
              key={participant.id} 
              value={`${participant.type}-${participant.name}`}
              sx={{ pl: 4 }}
            >
              {participant.name}
            </MenuItem>
          ))
        ])}
      </Select>

      <br/>
      <br/>
      {participantInfo && (
        <div>
          <p style={{ fontSize: '20px', marginBottom: '20px', color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR }}>
            <strong>Entrant:</strong> {participantInfo.name}
          </p>
          
          <p style={{ fontSize: '20px', marginBottom: '20px', color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR }}>
            <strong>Boards:</strong> {participantInfo.boards.map(b => b.boardName).join(', ')}
          </p>

          <p style={{ fontSize: '20px', marginBottom: '10px', color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR }}>
            <strong>Entered Pots: ({participantInfo.allPots.length})</strong>
          </p>
          {participantInfo.boards.map((board, index) => (
            <div key={index} style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <p style={{ 
                fontSize: '18px',
                color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR,
                marginBottom: '5px' 
              }}>
                <strong>{board.boardName}:</strong>
              </p>
              {board.pots.map((pot, potIndex) => (
                <p key={potIndex} style={{ 
                  fontSize: '18px', 
                  color: config?.stylingConfig?.CONFIG_STYLING_POTS_TITLE_TEXT_COLOR,
                  marginLeft: '20px' 
                }}>
                  {pot}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SimplifiedEntries;

