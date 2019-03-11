export default class DataSource {
  static ShiftInfo = `
{
  "shiftId": "4575ccb0-64ea-46a8-a909-7e470c006003", 
  "rigId": "g",
  "timeStart": "04:30",  
  "timeEnd": "17:30", 
  "comments": "TestUser", 
  "dateStart": "2019-03-05", 
  "foremanId": "c412e1dd-9499-3ce8-b773-d3494e2987ac", 
  "shiftType": "DAY", 
  "submitterId": "c412e1dd-9499-3ce8-b773-d3494e2987ac",
  "phaseProgress": 
      [
    	  {
          "phaseId": "9d1a2f48-ba66-3b80-9542-d732e0e68da9",
          "phaseType": "RIGUP",
          "phaseProgressType": "NON_DRILLING",
    		  "isComplete": true,
    		  "phaseTimeEnd": "5:45",
          "workUnits":
            [
            	{
			          "clockHours": "5",
			          "phasePoints": 100
            	}
		        ]
        }, 
        {
          "phaseId": "f6e65a28-35ed-3a46-80f8-5030ac9ca9da",
          "phaseType": "PILOT",
          "phaseProgressType": "DRILLING",
          "isComplete": true,
          "phaseTimeEnd": "8:30",
          "workUnits": 
            [
              {
                "id": "4e823b8c-8b45-4c0a-9540-6280d6256b7d", 
                "boreSize": 11, 
                "distance": 65, 
                "clockHours": 1, 
                "entryPoint": "ENTRY_SIDE",
                "workUnitMasterindex": 0,
                "workUnitIndex": 0 
              }, 
              {
                "id": "d08156c4-64bc-47ee-a285-b39ce9c548f0",
                "boreSize": 11, 
                "distance": 54, 
                "clockHours": 2, 
                "entryPoint": "ENTRY_SIDE",
                "workUnitIndex": 1,
                "workUnitMasterindex": 1
              }
            ] 
        }, 
        {
          "phaseId": "c2a7e207-e097-34cf-8057-a805c179689c",
          "phaseType": "OPEN",
          "phaseProgressType": "DRILLING",
          "isComplete": false,
          "phaseTimeEnd": "5:30", 
          "workUnits": 
            [
              {
                "id": "f57ff455-69a5-40d2-8c7e-7e8627483070", 
                "boreSize": 18, 
                "distance": 4, 
                "clockHours": 1, 
                "entryPoint": "EXIT_SIDE",
                "workUnitIndex": 0,
                "workUnitMasterindex": 2
              }
            ] 
          }
        ],
  "maybeOtherStuff":{},
  "lotsOfOtherStuff":{}
}
`;

  static TargetInfo = `{
    "diameter":48,
    "distance":1000
}`;
}
