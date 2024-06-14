import { 
  Animation,
  ArcRotateCamera, 
  CubicEase, 
  EasingFunction, 
  Vector3, 
  Viewport
} from '@babylonjs/core'
import { normalizeAlpha } from './utils'

export class DTCamera extends ArcRotateCamera {
  canvas: HTMLCanvasElement | null = null
  animationTotalFrame = 60
  animationDuration = 1
  animationFramePreSecond = this.animationTotalFrame / this.animationDuration
  animationEasing = new CubicEase()

  init(canvas: HTMLCanvasElement) {
    const camera = this    
    this.canvas = canvas
    camera.minZ = 2
    camera.maxZ = 3e3
    camera.panningAxis = new Vector3(1, 0, 1)
    camera.panningSensibility = 40
    camera.panningOriginTarget = new Vector3(-270, 0, -430)
    camera.panningDistanceLimit = 500
    camera.wheelPrecision = 10
    camera.allowUpsideDown = false
    camera.lowerRadiusLimit = 5
    camera.upperRadiusLimit = 400
    camera.lowerBetaLimit = .5
    camera.upperBetaLimit = Math.PI - .5
    camera.checkCollisions = true
    camera.collisionRadius = new Vector3(3, 3, 3)

    camera.viewport = new Viewport(0, 0, 1, 1)

    // this.keysUp.push(87)              // W
    // this.keysDown.push(83)            // S
    // this.keysLeft = [65]              // A, remove ArrowLeft 37
    // this.keysRight = [68]             // D, remove ArrowRight 39


    this.animationEasing.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
    camera.attachControl(this.canvas, true)
  }

  startAnimation(opt: { name: string, prop: string, from: any, to: any }) {
    return Animation.CreateAndStartAnimation(
      opt.name,
      this,
      opt.prop,
      this.animationFramePreSecond,
      this.animationTotalFrame,
      opt.from,
      opt.to,
      Animation.ANIMATIONLOOPMODE_CONSTANT,
      this.animationEasing
    )

  }
  // move looking at
  animateTarget(target: Vector3) {
    this.startAnimation({
      name: 'camera-target',
      prop: '_target',
      from: this.target,
      to: target,
    })
  }

  // move position
  animateSelfProp(target: Vector3) {
    this.startAnimation({
      name: 'camera-alpha',
      prop: 'alpha',
      from: normalizeAlpha(this.alpha),
      to: normalizeAlpha(target.x)
    })
 
    this.startAnimation({
      name: 'camera-beta',
      prop: 'beta',
      from: this.beta,
      to: target.y
    })

    this.startAnimation({
      name: 'camera-radius',
      prop: 'radius',
      from: this.radius,
      to: target.z
    })
  }
}