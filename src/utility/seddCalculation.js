export default class seddCalculation {
  ping(msg) {
    alert(msg);
  }

  static phaseProgressType = {
    NON_DRILLING: "NON_DRILLING",
    DRILLING: "DRILLING"
  };

  convertToSegment(phaseProgress, target) {
    let totalDistance = 0;
    let lastnode = 0;
    phaseProgress.map(phase => {
      if (
        phase.phaseProgressType === seddCalculation.phaseProgressType.DRILLING
      ) {
        phase.workUnits.map(unit => {
          totalDistance += unit.distance;
          lastnode = unit.boreSize;
        });
      }
    });
    alert(
      `Segment for this Data is ${lastnode}X${totalDistance}---${
        target.diameter
      }X${target.distance - totalDistance}`
    );
  }
}
