import { GlowLayer, Scene } from '@babylonjs/core'

export class DTGlowLayer extends GlowLayer {

  constructor(name: string, scene: Scene) {
    super(name, scene, {
      mainTextureSamples: 4
    })

    this.intensity = 0.8
    this.customEmissiveColorSelector = function (_mesh, _subMesh, _mat, result) {
      result.set(0, 0, 0, 0)
    }

  }
}