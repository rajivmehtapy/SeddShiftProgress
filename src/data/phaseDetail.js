export default class DataSource {
  static ShiftInfo = `
{
  "shiftId": "4575ccb0-64ea-46a8-a909-7e470c006003",
  "rigId": "g",
  "shiftTimeStart": "04:30",  
  "shiftTimeEnd": "17:30", 
  "comments": "some notes go here", 
  "dateStart": "2019-03-05", 
  "foremanId": "c412e1dd-9499-3ce8-b773-d3494e2987ac", 
  "shiftType": "DAY", 
  "submitterId": "c412e1dd-9499-3ce8-b773-d3494e2987ac",
  "shiftPhaseProgress": 
      [
        {
          "phaseId": "f6e65a28-35ed-3a46-80f8-5030ac9ca9da",
          "phaseType": "OPEN",
          "phaseProgressType": "DRILLING",
          "isComplete": true,
    		  "phaseTimeStart": "4:30 am", 
    		  "phaseTimeEnd": "17:30 pm",
    		  "phaseHours": 9,
    		  "phaseEvents": {},
          "workUnits": 
            [
              {
                "id": "4e823b8c-8b45-4c0a-9540-6280d6256b7d", 
                "boreSize": 30,
                "distance": 50, 
                "clockHours": 4.5, 
                "entryPoint": "ENTRY_SIDE",
                "workUnitIndex": 0 
              }, 
              {
                "id": "d08156c4-64bc-47ee-a285-b39ce9c548f0", 
                "boreSize": 24, 
                "distance": 75, 
                "clockHours": 2, 
                "entryPoint": "ENTRY_SIDE",
                "workUnitIndex": 1
              }
            ] 
          }
        ],
  "maybeOtherStuff": {},
  "lotsOfOtherStuff": {},
  "shiftDelay": ""
}
`;

static TargetInfo = `{
    "diameter":48,
    "distance":1000
}`;

static ActualArray = `[
  { "diameter": 36, "distance": 100 },
  { "diameter": 30, "distance": 200 },
  { "diameter": 24, "distance": 300 },
  { "diameter": 11, "distance": 100 }
]`;


// static ActualArray = `[
//    {"diameter": 54,"distance": 9},
//    {"diameter": 42,"distance": 3},
//    {"diameter": 40,"distance": 70},
//    {"diameter": 36,"distance": 18},
//    {"diameter": 30,"distance": 200},
//    {"diameter": 24,"distance": 300},
//    {"diameter": 11,"distance": 100},
//    {"diameter": 7, "distance": 10},
//    {"diameter": 2, "distance": 989}
// ]`;

static FinalArray = `[
  { "diameter": 36, "distance": 150 },
  { "diameter": 30, "distance": 200 },
  { "diameter": 24, "distance": 300 },
  { "diameter": 11, "distance": 100 }
]`;
}
