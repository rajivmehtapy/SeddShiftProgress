export default class seddCalculation {
  ping(msg) {
    alert(msg);
  }

  static phaseProgressType = {
    NON_DRILLING: "NON_DRILLING",
    DRILLING: "DRILLING"
  };

  convertToSegment(phaseProgress, target,actual,final) {
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
    // alert(
    //   `Segment for this Data is ${lastnode}X${totalDistance}---${
    //     target.diameter
    //   }X${target.distance - totalDistance} 
    //   Actual Volume ${actual}  
    //   Final Volume  ${final}
    //   Total Volume  ${final - actual}`
      
    // );
  }

  // diameter(dia, target_dia) {
  //   const total = dia / target_dia;
  //   const radius = total / 2;
  //   return radius;
  //   console.log("Result", radius);
  // }

  // distance(total_dis, actual_dis) {
  //   const current = total_dis / actual_dis;
  //   return current;
  //   console.log("Result for distance", current);
  // }

  // volume(pie, radius, height_dis) {
  //   const total_volume = pie * Math.pow(radius, 2) * height_dis;
  //   console.log("Result for volume", total_volume);
  //   return total_volume;
  // }
}
