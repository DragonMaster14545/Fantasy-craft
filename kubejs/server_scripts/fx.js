function drawCircles(e) {
  Object.values(circles).forEach(circle => {
    if (!(circle.displayed == false)) {
      if (e.server.runCommandSilent(`execute positioned ${circle.x} ${circle.y} ${circle.z} in ${circle.dimension} if entity @a[distance=..${circle.radius + 40}]`)) {
        drawCircle(e, circle)
      }
    }
  })
}
function drawCircle(e, circle) {
  let points = []
  for (let i = 0; i < circle.points; i++) {
    let theta = (i / circle.points) * 2 * JavaMath.PI
    let x = circle.x + circle.radius * Math.cos(theta)
    let y = circle.y + 0.1
    let z = circle.z + circle.radius * Math.sin(theta)
    points.push({ x: x.toFixed(2), y: y.toFixed(2), z: z.toFixed(2) })
  }
  let level = e.server.getLevel(circle.dimension)
  points.forEach(point => {
    level.sendParticles(circle.particle, point.x, point.y, point.z, 0, 0, 0, 1, 0)
  })
}
function drawSpheres(e) {
  Object.values(spheres).forEach(sphere => {
    if (!(sphere.displayed == false)) {
      if (e.server.runCommandSilent(`execute positioned ${sphere.x} ${sphere.y} ${sphere.z} in ${sphere.dimension} if entity @a[distance=..${sphere.radius + 40}]`)) {
        drawSphere(e, sphere)
      }
    }
  })
}
function drawSphere(e, sphere) {
  let points = [];

  for (let i = 0; i < sphere.points; i++) {
    let phi = (i / sphere.points) * JavaMath.PI;
    let y = sphere.y + sphere.radius * Math.cos(phi);
    let radiusAtHeight = sphere.radius * Math.sin(phi);

    for (let j = 0; j < sphere.verticalPoints; j++) {
      let theta = (j / sphere.verticalPoints) * 2 * JavaMath.PI;
      let x = sphere.x + radiusAtHeight * Math.cos(theta);
      let z = sphere.z + radiusAtHeight * Math.sin(theta);

      points.push({ x: x.toFixed(2), y: y.toFixed(2), z: z.toFixed(2) });
    }
  }
  let level = e.server.getLevel(sphere.dimension)
  points.forEach(point => {
    level.sendParticles(sphere.particle, point.x, point.y, point.z, 0, 0, 0, 1, 0)
  });
}
function drawClientSpheresToAllPlayers(e, x, y, z, spheres, dim) {
  e.server.getLevel(dim).getPlayers().forEach(player => {
    if (player.distanceToSqr(new Vec3d(x, y, z)) <= 50) {
      player.sendData('draw_spheres', { spheres: spheres })
    }
  })
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
      level.sendParticles(cuboid.particle, point.x.toFixed(2), point.y.toFixed(2), point.z.toFixed(2), 0, 0, 0, 1, 0);
    });
  });
}

function getLinePoints(x1, y1, z1, x2, y2, z2, pointAmount) {
  let points = [];
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let dz = Math.abs(z2 - z1);
  let steps = pointAmount
  let xIncrement = (x2 - x1) / steps;
  let yIncrement = (y2 - y1) / steps;
  let zIncrement = (z2 - z1) / steps;
  let x = x1;
  let y = y1;
  let z = z1;
  for (let i = 0; i <= steps; i++) {
    points.push({ x: x, y: y, z: z });
    x += xIncrement;
    y += yIncrement;
    z += zIncrement;
  }
  return points;
}

