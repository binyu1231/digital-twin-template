import cameraPresetJson from './camera.json'
import { CameraPreset } from '../types'

export enum DTBehaviourMode {
  stay,
  move
}

export const DTConfig = {

}




const CAMERA_POSITION: CameraPreset = cameraPresetJson as any

export { CAMERA_POSITION }