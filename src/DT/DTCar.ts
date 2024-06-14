import { Mesh, Vector3 } from '@babylonjs/core'
import { DTBehaviourMode } from './configure'

// face
export enum DTCarFacade {
  normal = 1
}



export interface DTCarOption {
  from: Vector3
  to: Vector3
  roadline: Vector3[],
  facade: DTCarFacade,
  mode: DTBehaviourMode
}

export class DTCar {

  facade: DTCarFacade = DTCarFacade.normal
  mode: DTBehaviourMode = DTBehaviourMode.stay

  from: Vector3 = Vector3.Zero()
  to: Vector3 = Vector3.Zero()
  mesh: Mesh | null = null

  static create(opt: DTCarOption) {
    const car = new DTCar()

    return car
  }
  
  constructor() {
    
  }

  blink() {
    /// WIP
  }

  move() {
    if (this.mode !== DTBehaviourMode.move) return

    // WIP
  }

  dispose() {
    this.mesh?.dispose()

  }
}