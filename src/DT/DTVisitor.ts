import { Mesh, Vector3 } from '@babylonjs/core'
import { DTBehaviourMode } from './configure'

export enum DTVisitorFacade {
  normal
}

export interface DTVisitorOption {

}

export class DTVisitor {
  facade: DTVisitorFacade = DTVisitorFacade.normal
  mode: DTBehaviourMode = DTBehaviourMode.stay

  from: Vector3 = Vector3.Zero()
  to: Vector3 = Vector3.Zero()
  mesh: Mesh | null = null

  static create(opt: DTVisitorOption) {
    const visitor = new DTVisitor()

    return visitor
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