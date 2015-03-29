Class("MeshManager", {
    MeshManager: function() {
        //creating hashmap for storing meshes
        //creating list of allowed meshes
        //remember last clicked mesh
        this.map = new HashMap();
        this.meshes = [];
        this.lastClicked = undefined;
        this.allowedMeshes = [
            "cube",
            "sphere",
            "cylinder",
            "plane",
            "dodecahedron",
            "tube",
            "thorus"
        ];
        this.allowedLights = [
            "ambientLight",
            "pointLight"
        ];
    },

    store: function(uuid, element) {
        this.map.put(uuid, element);
    },

    addMesh: function(type) {
        /*
            if type is allowed, proceed to call the proper creation method
            then store it inside our map, adding a callback method
            to the stored mesh -> listening to user click;
        */
        if (this.allowedMeshes.indexOf(type) != -1) {
            //we're creating a valid mesh
            var mesh = this["_add"+__upperCaseFirstLetter__(type)]();
            //add new mesh to the scene and to meshes list
            app.sm.scene.add(mesh);
            app.mm.meshes.push(mesh);
            //store new mesh in our map
            app.mm.store(mesh.uuid, mesh);
            //forcing scene to update itself
            app.sm.update();
            //attach new mesh to transform control
            //app.sm.transformControl.attach(mesh);
            //creating a callback for our mesh
            app.interface.meshEvents.bind(mesh, "click", function(event) {
                //now only adding this mesh to the transform control
                if (app.sm.lastClicked) {
                    if (app.sm.lastClicked.uuid == event.target.uuid) return;
                    app.sm.transformControl.detach(app.sm.lastClicked);
                }
                app.sm.transformControl.setMode("translate");
                app.sm.transformControl.attach(event.target);
                app.mm.lastClicked = event.target;
            });
        }
    },

    addLight: function(type) {
        if (this.allowedLights.indexOf(type) != -1) {
            var object = this["_add"+__upperCaseFirstLetter__(type)]();
            //adding light to scene
            app.sm.scene.add(object.light);
            //check if this light has helper
            if (object.helper) {
                //add helper to scene
                app.sm.scene.add(object.helper);
                //ading helper to mesh lists
                app.mm.meshes.push(object.helper);
                //adding click listener to helper
                app.interface.meshEvents.bind(object.helper, "click", function(event) {
                    //now only adding this mesh to the transform control
                    if (app.sm.lastClicked) {
                        if (app.sm.lastClicked.uuid == event.target.uuid) return;
                        app.sm.transformControl.detach(app.sm.lastClicked);
                    }
                    app.sm.transformControl.setMode("translate");
                    app.sm.transformControl.attach(event.target);
                    app.mm.lastClicked = event.target;
                });
            }
            //storing this light
            app.mm.store(object.light.uuid, object);
            //forcing scene update
            app.sm.update();
        }
    },

    onMouseDown: function() {
        if (app.mm.lastClicked) {
            app.sm.transformControl.detach(app.sm.lastClicked);
        }
    },

    //Creation methods

    _addCube: function() {
        var geo, mat, cube;

        geo = new THREE.BoxGeometry(100, 100, 100);
        mat = new THREE.MeshBasicMaterial({wireframe: true, color: Math.random() * 0xffffff});
        cube = new THREE.Mesh(geo, mat);

        return cube;
    },

    _addSphere: function() {
        var geo, mat, sphere;

        geo = new THREE.SphereGeometry(50, 32, 32);
        mat = new THREE.MeshBasicMaterial({wireframe: true, color: Math.random() * 0xffffff});
        sphere = new THREE.Mesh(geo, mat);

        return sphere;
    },

    _addCylinder: function() {
        var geo, mat, cyl;
        
        geo = new THREE.CylinderGeometry( 50, 50, 20, 32 );
        mat = new THREE.MeshBasicMaterial({wireframe: true, color: Math.random() * 0xffffff});
        cyl = new THREE.Mesh(geo, mat);

        return cyl;
    },

    _addPlane: function() {
        var geo, mat, plane;

        geo = new THREE.PlaneGeometry(50, 20, 32);
        mat = new THREE.MeshBasicMaterial({wireframe: true, color: Math.random() * 0xffffff});
        plane = new THREE.Mesh(geo, mat);

        return plane;
    },

    _addDodecahedron: function() {
        var geo, mat, dode;

        geo = new THREE.DodecahedronGeometry(50);
        mat = new THREE.MeshBasicMaterial({wireframe: true, color: Math.random() * 0xffffff});
        dode = new THREE.Mesh(geo, mat);

        return dode;
    },

    _addTube: function() {
        var geo, mat, tube;

        var CustomSinCurve = THREE.Curve.create(
            function ( scale ) { //custom curve constructor
                this.scale = (scale === undefined) ? 1 : scale;
            },
            
            function ( t ) { //getPoint: t is between 0-1
                var tx = t * 3 - 1.5,
                    ty = Math.sin( 2 * Math.PI * t ),
                    tz = 0;
                
                return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
            }
        );

        var path = new CustomSinCurve( 10 );

        geo = new THREE.TubeGeometry(path, 20, 20, 80, false);
        mat = new THREE.MeshBasicMaterial({wireframe: true, color: Math.random() * 0xffffff});
        tube = new THREE.Mesh(geo, mat);

        return tube;
    },

    _addThorus: function() {
        var geo, mat, tho;

        geo = new THREE.TorusGeometry(100, 30, 16, 100);
        mat = new THREE.MeshBasicMaterial({wireframe: true, color: Math.random() * 0xffffff});
        tho = new THREE.Mesh(geo, mat);

        return tho;
    },

    // lights

    _addAmbientLight: function() {
        var light;

        light = new THREE.AmbientLight(0x404040);

        return {
            "light": light,
            "helper": false
        };

    },

    _addPointLight: function() {

        var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
        pointLight.position.set( 10, 10, 10 );

        var sphereSize = 50;
        var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );

        return {
            light: pointLight,
            helper: pointLightHelper
        };
    }


});