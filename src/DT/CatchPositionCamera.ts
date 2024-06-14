import { 
  Scene,
  UniversalCamera, 
  Vector3
} from '@babylonjs/core'
import { cartesianToSpherical } from './utils'

export interface CatchPositionCameraOptions {
  x: number,
  y: number,
  z: number,
  targetX: number,
  targetY: number,
  targetZ: number,
  fixed: number

}

export class CatchPositionCamera extends UniversalCamera {

  options: CatchPositionCameraOptions
  #uiBox: HTMLElement | null = null
  constructor(
    name: string, 
    options: Partial<CatchPositionCameraOptions>, 
    scene: Scene
  ) {
    const opts: CatchPositionCameraOptions = Object.assign<any, any>({
      x: 100,
      y: 100,
      z: 100,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      fixed: 2
      
    }, options)

    super(name, new Vector3(opts.x, opts.y, opts.z), scene)

    this.options = opts
    this.target = new Vector3(opts.targetX, opts.targetY, opts.targetZ)

    this.initKeyboardControl()
    this.initUI()
  }
  
  getPosition() {
    const val = {
      position: [this.position.x, this.position.y, this.position.z],
      target: [this.target.x, this.target.y, this.target.z]
    }
    console.log(val)
    return val 
  }

  initKeyboardControl() {
    this.keysUp.push(87)              // W
    this.keysDown.push(83)            // S
    this.keysLeft = [65]              // A, remove ArrowLeft 37
    this.keysRight = [68]             // D, remove ArrowRight 39
    this.keysRotateLeft.push(81, 37)  // Q, ArrowLeft
    this.keysRotateRight.push(69, 39) // E, ArrowRight

  }

  initUI() {
    const uiBox = document.getElementById('catch-camera') || document.createElement('div')

    uiBox.id = 'catch-camera'
    uiBox.style.fontSize = '12px'
    uiBox.style.position = 'fixed'
    uiBox.style.right = '10px'
    uiBox.style.top = '10px'
    uiBox.style.border = '1px solid black'
    uiBox.style.padding = '6px'
    uiBox.style.zIndex = '1000'
    uiBox.style.background = 'rgba(255, 255, 255, .6)'

    document.body.appendChild(uiBox)
    this.#uiBox = uiBox
  } 

  updateUI() {
    if (!this.#uiBox) return
    const f = (n:number) => n.toFixed(this.options.fixed)
    const { alpha, beta, radius } = cartesianToSpherical(this.position.x, this.position.y, this.position.z)
    this.#uiBox.innerHTML = `
      <p>position: (${f(this.position.x)}, ${f(this.position.y)}, ${f(this.position.z)})</p>
      <p>arc: (${f(alpha)}, ${f(beta)}, ${f(radius)})</p>
      <p>target: (${f(this.target.x)}, ${f(this.target.y)}, ${f(this.target.z)})</p>
    `
  }
}
