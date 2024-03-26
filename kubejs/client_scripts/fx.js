NetworkEvents.dataReceived('draw_spheres', e => {
  let data = e.data
  let spheres = data.spheres
  spheres.forEach(sphere => {
    drawSphere(sphere)
  })
})
NetworkEvents.dataReceived('draw_circle', e => {
  let data = e.data
  let circles = data.circles
  circles.forEach(circle => {
    drawCircle(circle)
  })
})
NetworkEvents.dataReceived('draw_cubes', e => {
  let data = e.data
  let cubes = data.cubes
  cubes.forEach(cube => {
    drawCube(cube)
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
function drawCircle(circle) {
  for (let i = 0; i < circle.points; i++) {
    let theta = (i / circle.points) * 2 * JavaMath.PI
    let x = circle.x + circle.radius * Math.cos(theta)
    let y = circle.y + 0.1
    let z = circle.z + circle.radius * Math.sin(theta)
    Client.level.addParticle(circle.particle, x, y, z, 0, 0, 0)
  }
}
function drawCube(e, cuboid) {
  let edges = [
    { x1: cuboid.x1, y1: cuboid.y1, z1: cuboid.z1, x2: cuboid.x2, y2: cuboid.y1, z2: cuboid.z1 },
    { x1: cuboid.x2, y1: cuboid.y1, z1: cuboid.z1, x2: cuboid.x2, y2: cuboid.y2, z2: cuboid.z1 },
    { x1: cuboid.x2, y1: cuboid.y2, z1: cuboid.z1, x2: cuboid.x1, y2: cuboid.y2, z2: cuboid.z1 },
    { x1: cuboid.x1, y1: cuboid.y2, z1: cuboid.z1, x2: cuboid.x1, y2: cuboid.y1, z2: cuboid.z1 },
    { x1: cuboid.x1, y1: cuboid.y1, z1: cuboid.z1, x2: cuboid.x1, y2: cuboid.y1, z2: cuboid.z2 },
    { x1: cuboid.x2, y1: cuboid.y1, z1: cuboid.z1, x2: cuboid.x2, y2: cuboid.y1, z2: cuboid.z2 },
    { x1: cuboid.x2, y1: cuboid.y2, z1: cuboid.z1, x2: cuboid.x2, y2: cuboid.y2, z2: cuboid.z2 },
    { x1: cuboid.x1, y1: cuboid.y2, z1: cuboid.z1, x2: cuboid.x1, y2: cuboid.y2, z2: cuboid.z2 },
    { x1: cuboid.x1, y1: cuboid.y1, z1: cuboid.z2, x2: cuboid.x2, y2: cuboid.y1, z2: cuboid.z2 },
    { x1: cuboid.x2, y1: cuboid.y1, z1: cuboid.z2, x2: cuboid.x2, y2: cuboid.y2, z2: cuboid.z2 },
    { x1: cuboid.x2, y1: cuboid.y2, z1: cuboid.z2, x2: cuboid.x1, y2: cuboid.y2, z2: cuboid.z2 },
    { x1: cuboid.x1, y1: cuboid.y2, z1: cuboid.z2, x2: cuboid.x1, y2: cuboid.y1, z2: cuboid.z2 }
  ];

  let level = e.server.getLevel(cuboid.dimension);
  edges.forEach(edge => {
    let points = getLinePoints(edge.x1, edge.y1, edge.z1, edge.x2, edge.y2, edge.z2, cuboid.points / 10);
    points.forEach(point => {
      Client.level.addParticle(cuboid.particle, x, y, z, 0, 0, 0)
    });
  });
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
