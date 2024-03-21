NetworkEvents.dataReceived('draw_spheres', e => {
  let data = e.data
  let spheres = data.spheres
  spheres.forEach(sphere => {
    drawSphere(sphere)
  })
})
function drawSphere(sphere) {
  let pi = JavaMath.PI
  let points = sphere.points
  let verticalPoints = sphere.verticalPoints
  let radius = sphere.radius
  let sphereX = sphere.x
  let sphereY = sphere.y
  let sphereZ = sphere.z
  let particle = sphere.particle

  for (let i = 0; i < points; i++) {
    let phi = (i / points) * pi;
    let y = sphereY + radius * Math.cos(phi);
    let radiusAtHeight = radius * Math.sin(phi);

    for (let j = 0; j < verticalPoints; j++) {
      let theta = (j / verticalPoints) * 2 * pi;
      let x = sphereX + radiusAtHeight * Math.cos(theta);
      let z = sphereZ + radiusAtHeight * Math.sin(theta);
      Client.level.addParticle(particle, x, y, z, 0, 0, 0)
    }
  }
}
/*
let tick = 0
ClientEvents.tick(e => {
  tick++
  if(tick >= 5) {
    tick = 0
    drawSphere({ x: 0, y: 0, z: 0, radius: 30, points: 150, verticalPoints:150,particle:'minecraft:cloud'})
  }
})
*/
