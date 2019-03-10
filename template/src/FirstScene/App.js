import {
    App,
    ControlsManager,
    SceneManager
} from 'mage-engine';

export default class FirstScene extends App {

    constructor(config, container) {
        super(config, container);
    }

    onCreate() {
        ControlsManager.setOrbitControl();
        window.cube = this.sceneHelper.addCube(20, 0xffffff);

        SceneManager.camera.position({y: 70, z: 150});
        SceneManager.camera.lookAt(0, 0, 0);

        this.sceneHelper.addGrid(200, 20);
        cube.position({z: 10});
    }
}
