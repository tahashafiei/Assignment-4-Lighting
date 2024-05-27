class Camera {
    constructor() {
        this.fov = 90;
        this.eye = new Vector3([0, 0, 0]);
        this.at = new Vector3([1, -1, -1]);
        this.up = new Vector3([0, 1, 0]);

        this.nearDist = 0.1;
        this.farDist = 200;
        this.aspectRatio = canvas.width / canvas.height;

        this.viewMatrix = new Matrix4().setIdentity();
        this.viewMatrix.setLookAt(this.eye.x, this.eye.y, this.eye.z, this.at.x, this.at.y, this.at.z, this.up.x, this.up.y, this.up.z);
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMatrix.elements);

        this.projectionMatrix = new Matrix4().setIdentity();
        this.projectionMatrix.setPerspective(this.fov, this.aspectRatio, this.nearDist, this.farDist);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projectionMatrix.elements);
    }

    get forward() {
        return this.at.sub(this.eye).normalize();
    }

    get right() {
        return this.forward.cross(this.up).normalize();
    }

    applyProjectionMatrix() {
        this.projectionMatrix.setPerspective(this.fov, this.aspectRatio, this.nearDist, this.farDist);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projectionMatrix.elements);
    }

    moveForward(speed) {
        let forwardVector = this.forward.mul(speed);

        this.eye = this.eye.add(forwardVector);
        this.at = this.at.add(forwardVector);
    }

    moveBackward(speed) {
        let forwardVector = this.forward.mul(speed);

        this.eye = this.eye.sub(forwardVector);
        this.at = this.at.sub(forwardVector);
    }

    moveLeft(speed) {
        let rightVector = this.right.mul(speed);

        this.eye = this.eye.sub(rightVector);    
        this.at = this.at.sub(rightVector);
    }

    moveRight(speed) {
        let rightVector = this.right.mul(speed);

        this.eye = this.eye.add(rightVector);    
        this.at = this.at.add(rightVector);
    }

    moveUp(speed) {
        let upVector = this.up.mul(speed);

        this.eye = this.eye.add(upVector);
        this.at = this.at.add(upVector);
    }

    moveDown(speed) {
        let upVector = this.up.mul(speed);

        this.eye = this.eye.sub(upVector);
        this.at = this.at.sub(upVector);
    }
}