export default class DataSource {
  static ShiftWorkUnits = `  [
    { "diameter": 30, "distance": 150 },
    { "diameter": 24, "distance": 100 }
  ]
`;

  static ShiftWorkUnitsBlanks = `  [
    { "diameter": 30, "distance": 0 },
    { "diameter": 24, "distance": 0 }
  ]
`;

  static ShiftWorkUnitsForClear = `  [
    { "diameter": 0, "distance": 0 },
    { "diameter": 0, "distance": 0 },
    { "diameter": 0, "distance": 0 },
    { "diameter": 0, "distance": 0 },
    { "diameter": 0, "distance": 0 },
    { "diameter": 0, "distance": 0 }
  ]
`;

  static ActualArrayForClear = `[
  { "diameter": 0, "distance": 0 },
  { "diameter": 0, "distance": 0 },
  { "diameter": 0, "distance": 0 },
  { "diameter": 0, "distance": 0 }
]`;

  static DECIMAL_POINTS = 4;
  static DRILL_PLAN = {
    diameter: 48,
    distance: 1500
  };
  static PILOT_PLAN = {
    diameter: 11,
    distance: 1500
  };
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
                "distance": 150, 
                "clockHours": 4.5, 
                "entryPoint": "ENTRY_SIDE",
                "workUnitIndex": 0 
              }, 
              {
                "id": "d08156c4-64bc-47ee-a285-b39ce9c548f0", 
                "boreSize": 24, 
                "distance": 100, 
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
  { "diameter": 0, "distance": 0 },
  { "diameter": 0, "distance": 0 },
  { "diameter": 0, "distance": 0 },
  { "diameter": 0, "distance": 0 }
]`;

  static checkArray = [
    { diameter: 36, distance: 100 },
    { diameter: 30, distance: 250 },
    { diameter: 24, distance: 325 },
    { diameter: 11, distance: 25 }
  ];

  static PHASE_STEPS = [
    {
      id: 1,
      title: "Rigup",
      nextid: 2,
      type: 0,
      phaseWeight: 20
    },
    {
      id: 2,
      title: "Pilot",
      nextid: 3,
      type: 1,
      phaseWeight: 20
    },
    {
      id: 3,
      title: "Open",
      nextid: 4,
      type: 1,
      phaseWeight: 47
    },
    {
      id: 4,
      title: "Close",
      nextid: -1,
      type: 0,
      phaseWeight: 13
    }
  ];
  static SHIFT_STATUS_WORKUNIT = {
    phaseType: "",
    isComplete: false,
    percentComplete: 0,
    volume: 0,
    segment: "[]",
    phaseProgressType: "",
    phaseWeight: 0,
    phaseIndex: 0,
    phaseId: ""
  };

  static SHIFT_STATUS_DATA = {
    dateStart: "",
    drillId: "",
    drillSlug: "",
    drillOpenPlan: {
      diameter: 0,
      distance: 0
    },
    drillPilotPlan: {
      diameter: 0,
      distance: 0
    },
    currentPhaseType: "",
    currentPhaseProgressType: "",
    currentPhasePercentComplete: 0,
    drillPhaseStatus: {
      Rigup: {
        phaseType: "RIGUP",
        isComplete: false,
        percentComplete: 0,
        phaseProgressType: "NON_DRILLING",
        phaseWeight: 0,
        phaseIndex: 0,
        phaseId: ""
      },
      Pilot: {
        phaseType: "PILOT",
        isComplete: false,
        percentComplete: 0,
        phaseProgresype: "DRILLING",
        phaseWeight: 0,
        volume: 0,
        segment: "[]",
        phaseIndex: 1,
        phaseId: ""
      },
      Open: {
        phaseType: "OPEN",
        isComplete: false,
        percentComplete: 0,
        phaseProgressType: "DRILLING",
        phaseWeight: 0,
        volume: 0,
        segment: "[]",
        phaseIndex: 2,
        phaseId: ""
      },
      Close: {
        phaseType: "CLOSE",
        isComplete: false,
        percentComplete: 0,
        phaseProgressType: "NON_DRILLING",
        phaseWeight: 0,
        phaseIndex: 3,
        phaseId: ""
      }
    },
    otherDataIfNeeded: {}
  };

  static SHIFT_STATUS_SAMPLE_DATA = {
    dateStart: "",
    drillId: "",
    drillSlug: "",
    drillOpenPlan: {
      diameter: 0,
      distance: 0
    },
    drillPilotPlan: {
      diameter: 0,
      distance: 0
    },
    currentPhaseType: "",
    currentPhaseProgressType: "",
    currentPhasePercentComplete: 0,
    drillPhaseStatus: {
      rigup: {
        phaseType: "RIGUP",
        isComplete: false,
        percentComplete: 1.0,
        phaseProgressType: "NON_DRILLING",
        phaseWeight: 0.1,
        phaseIndex: 0,
        phaseId: ""
      },
      pilot: {
        phaseType: "PILOT",
        isComplete: false,
        percentComplete: 0.378,
        phaseProgresype: "DRILLING",
        phaseWeight: 0.3,
        volume: 33,
        segment: "[]",
        phaseIndex: 1,
        phaseId: ""
      },
      open: {
        phaseType: "OPEN",
        isComplete: false,
        percentComplete: 0.0,
        phaseProgressType: "DRILLING",
        phaseWeight: 0.5,
        volume: 0,
        segment: "[]",
        phaseIndex: 2,
        phaseId: ""
      },
      close: {
        phaseType: "CLOSE",
        isComplete: false,
        percentComplete: 0.0,
        phaseProgressType: "NON_DRILLING",
        phaseWeight: 0.1,
        phaseIndex: 3,
        phaseId: ""
      }
    },
    otherDataIfNeeded: {}
  };
}
