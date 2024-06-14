import {
  ShaderMaterial,
  Color3,
  Color4,
  CubeTexture,
  Engine,
  HemisphericLight,
  MeshBuilder,
  PBRMaterial,
  PBRMetallicRoughnessMaterial,
  PhotoDome,
  Scene,
  SceneLoader,
  Texture,
  Vector3,
  Viewport,
  Effect,
  StandardMaterial,
  GlowLayer,
  Light,
  DirectionalLight
} from '@babylonjs/core'
import { DTCamera } from './DTCamera'
import { colorV3, createRect, onClickPick } from './utils'
import { CatchPositionCamera } from './CatchPositionCamera'
import earcut from 'earcut'
import { DTGlowLayer } from './DTGlowLayer'
import { DTHighlightLayer } from './DTHightLight'
import { DTMedia } from './DTMedia'
import { debounce } from '@coloration/kit'
export class DTM {

  static BG_COLOR = new Color4(.792, .926, .923, 1)
  static GROUND_NAME = 'infiniground'
  static #uniqueInstance: DTM

  static init(canvas: HTMLCanvasElement) {
    if (DTM.#uniqueInstance) return DTM.#uniqueInstance
    DTM.#uniqueInstance = new DTM(canvas)
  }

  static get instance() {
    if (!DTM.#uniqueInstance) {
      throw new ReferenceError('DTM has not been initialized.')
    }
    return DTM.#uniqueInstance
  }

  debugMode: boolean = true
  engine: Engine
  scene: Scene
  camera: DTCamera
  media: DTMedia
  glow: DTGlowLayer
  highlight: DTHighlightLayer
  canvas: HTMLCanvasElement
  lights: Record<string, Light> = {}



  constructor(canvas: HTMLCanvasElement) {
    this.debugMode = false // !import.meta.env.PROD
    this.canvas = canvas
    this.engine = new Engine(canvas, true)
    this.scene = new Scene(this.engine, {})
    this.camera = new DTCamera(
      'camera',     // name
      2,            // alpha: horizontal angle
      1,  // beta: vertical angle
      1000,          // radius
      new Vector3(0, 0, 0), // look at
      this.scene
    )

    // new CatchPositionCamera('debug-camera', {}, this.scene)


    this.#initScene()
    this.camera.init(this.canvas)

    let walkCamera: CatchPositionCamera
    if (this.debugMode) {
      onClickPick(this.scene, DTM.GROUND_NAME, (info) => {
        console.log(info)
      })

      walkCamera = new CatchPositionCamera('debug-camera', {}, this.scene)
      walkCamera.viewport = new Viewport(.75, .75, .25, .25)
      walkCamera.initUI()
      walkCamera.attachControl(this.canvas, true)
    }


    this.engine.runRenderLoop(() => {
      this.scene.activeCamera = this.camera
      this.scene.render()

      if (this.debugMode) {
        this.scene.activeCamera = walkCamera
        this.scene.render()
        walkCamera.updateUI()
      }
    })

    window.addEventListener('resize', this.#resize)

    // 辉光层
    this.glow = new DTGlowLayer('dt-glow', this.scene)
    
    this.highlight = new DTHighlightLayer('dt-highlight', this.scene)

    // 
    this.media = new DTMedia()
  }

  #initScene() {
    const scene = this.scene
    // background color
    scene.clearColor = DTM.BG_COLOR
    scene.collisionsEnabled = false
    // 指示场景在渲染帧之前是否必须清除渲染缓冲区
    scene.autoClear = false
    // 指示场景在渲染帧之前是否必须清除深度和模板缓冲区
    scene.autoClearDepthAndStencil = false


    /// enviorment light
    const envLight = this.lights.env = new HemisphericLight('ambient-light', new Vector3(0, 1, 0), this.scene)
    envLight.intensity = .3

   

    // 没有光照的情况下，提供颜色
    const env = CubeTexture.CreateFromPrefilteredData('/environment.env', scene)
    scene.environmentTexture = env

    const skybox = new PhotoDome(
      'skybox',
      '/skybox-night.jpg',
      { size: 2e3 }, scene)
    skybox.position.set(-300, 0, 400)
  }

  loadBuildings() {
    /// Load Model

  }

  async loadLandscape() {
    /// Load model
    // WIP
    const ground = MeshBuilder.CreateGround(DTM.GROUND_NAME, {
      // 比天空盒要大
      width: 3e3,
      height: 3e3,
    }, this.scene)



    // 检测碰撞
    ground.checkCollisions = true

    // 地面材质
    const groundMat = new PBRMetallicRoughnessMaterial(DTM.GROUND_NAME, this.scene)
    groundMat.baseColor = colorV3(6, 31, 49)
    ground.material = groundMat
    ground.position.y = -1


   




   

  }

  #resize = debounce(50, () => {
    this.engine.resize(true)
  })

  async test() {
    /// 3D 字体
    // window.earcut = earcut
    // const fontData = await (await fetch("https://assets.babylonjs.com/fonts/Droid Sans_Regular.json")).json()
    // const text = MeshBuilder.CreateText('test-text', 'abc', fontData, {
    //   size: 100,
    //   resolution: 64, 
    //   depth: 10
    // }, this.scene)
    
    
    /// 发光片
    const plane = MeshBuilder.CreatePlane('test-plane', { size: 100, }, this.scene)
    
    const mat = new StandardMaterial('test-plane-material', this.scene)
    mat.emissiveColor = Color3.Teal()
    // mat.wireframe = true
    plane.material = mat
    plane.position.y = 0
    plane.rotation.x = Math.PI / 2
    // this.highlight.addMesh(plane, Color3.Black())
    // this.highlight.addMesh(text!, Color3.Red())
    this.glow.referenceMeshToUseItsOwnMaterial(plane)
    // 方块
    const rectWire = createRect('test-rect', { position: new Vector3(50, 10, 50), size: 200, color: Color3.Green() }, this.scene)
    // 路线
    this.glow.referenceMeshToUseItsOwnMaterial(rectWire)
  }

  log() {
    if (!this.debugMode) return

    console.log(arguments)
  }

}