import { Vector3 } from '@babylonjs/core'
import { DTM } from './DTM'

export class DTBuilding {
  name: string = ''
  position: Vector3 = Vector3.Zero()
  monitorPosition: Vector3 = Vector3.Zero()

  activeFloor(floorName: string) {

  }

  active() {

  }

  dispose() {
    
  }
}


export class DTBuildingController {

  buildings: DTBuilding[] = []
  current: number = 0

  constructor() {
    /// load model
    // WIP

    /// change mesh name
    // WIP
  }

  changeViewing(name: string) {
  }

  changeFloor(name: string) {

  }

  activeBuild(name: string) {
    this.current = this.buildings.findIndex(b => b.name === name)
    const activeBuilding = this.buildings[this.current]
    activeBuilding.active()

    const camera = DTM.instance.camera
    camera.animateTarget(activeBuilding.position)
    camera.animateSelfProp(activeBuilding.monitorPosition)
  }



}