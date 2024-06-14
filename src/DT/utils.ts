import { Color3, PickingInfo, Vector3, Scene, CreateGreasedLine } from '@babylonjs/core'

export function normalizeAlpha(alpha: number) {
  const t = 2 * Math.PI
    , n = Math.floor(alpha / t)
  return alpha - (n > 1 ? n * t : 0)
}

export function getAlphaBetaRadius(alpha: number, beta: number, radius: number) {
  return new Vector3(
    Math.round(100 * normalizeAlpha(alpha)) / 100,
    Math.round(100 * beta) / 100,
    Math.round(100 * radius) / 100
  )
}


export function sphericalToCartesian (alpha: number, beta: number, radius: number) {
  const x = radius * Math.sin(beta) * Math.cos(alpha)
  const y = radius * Math.cos(beta)
  const z = radius * Math.sin(beta) * Math.sin(alpha)
  return { x, y, z }
}

export function cartesianToSpherical(x: number, y: number, z: number) {
  const radius = Math.sqrt(x * x + y * y + z * z);
  const alpha = Math.atan2(z, x);
  const beta = Math.acos(y / radius)
  return { alpha, beta, radius }
}


export function colorV3(r: number, b: number, g: number) {
  return new Color3(r/255, b/255, g/255)
}

export function createRect(
  name: string, 
  option: {
    position?: Vector3, size: number, color: Color3, width?: number
  },
  scene?: Scene
) {

  const p = option.position || Vector3.Zero()
  const sizeOffset = option.size / 2
  const startP = new Vector3(p.x - sizeOffset, p.y, p.z - sizeOffset)
  const points: Vector3[] = [
    startP,
    new Vector3(p.x + sizeOffset, p.y, p.z - sizeOffset),
    new Vector3(p.x + sizeOffset, p.y, p.z + sizeOffset),
    new Vector3(p.x - sizeOffset, p.y, p.z + sizeOffset),
    startP
  ]
  
  return CreateGreasedLine(name, {
    points
  }, {
    color: option.color,
    width: option.width || 10,
    dashCount: 10,
    dashRatio: 0.4,
  }, scene)
}


function createArrowLine() {

}



export function onClickPick (
  scene: Scene, 
  targetName: string, 
  cb: (pickingInfo: PickingInfo) => void
) {
  function handlePick(e: MouseEvent) {
    const pickInfo = scene.pick(e.clientX, e.clientY, (mesh) => {
      return mesh.name === targetName
    })

    cb(pickInfo)    
  }

  window.addEventListener('click', handlePick)


  return function () {
    window.removeEventListener('click', handlePick)
  }
}

