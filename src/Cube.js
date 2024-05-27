class Cube {
    constructor() {
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.spec = 20;
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();

        this.coordinates = [
            [-(1/2), -(1/2), -(1/2)],
            [-(1/2), -(1/2), (1/2)],
            [-(1/2), (1/2), -(1/2)],
            [-(1/2), (1/2), (1/2)],
            [(1/2), -(1/2), -(1/2)],
            [(1/2), -(1/2), (1/2)],
            [(1/2), (1/2), -(1/2)],
            [(1/2), (1/2), (1/2)],
        ];

        this.allVerts = [];

        this.allVerts = this.allVerts.concat(this.t(0, 2, 4));
        this.allVerts = this.allVerts.concat(this.t(4, 2, 6));
        
        this.allVerts = this.allVerts.concat(this.t(4, 6, 5));
        this.allVerts = this.allVerts.concat(this.t(5, 6, 7));

        this.allVerts = this.allVerts.concat(this.t(5, 7, 1));
        this.allVerts = this.allVerts.concat(this.t(1, 7, 3));

        this.allVerts = this.allVerts.concat(this.t(1, 3, 0));
        this.allVerts = this.allVerts.concat(this.t(0, 3, 2));

        this.allVerts = this.allVerts.concat(this.t(2, 3, 6));
        this.allVerts = this.allVerts.concat(this.t(6, 3, 7));

        this.allVerts = this.allVerts.concat(this.t(1, 0, 5));
        this.allVerts = this.allVerts.concat(this.t(5, 0, 4));

        this.normals = [
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            -1, 0, 0, -1, 0,  0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        ];
    }

    t(a, b, c) {
        let l = [];
        l = l.concat(this.coordinates[a]);
        l = l.concat(this.coordinates[b]);
        l = l.concat(this.coordinates[c]);

        return l;
    }
    
    render() {
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniform4fv(u_FragColor, new Float32Array(this.color));
        gl.uniform1f(u_SpecularExponent, this.spec);

        this.normalMatrix.setInverseOf(this.matrix);
        this.normalMatrix.transpose();
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        let vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create buffer obj');
            return -1;
        }

        let verticesF32 = new Float32Array(this.allVerts);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesF32, gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        let normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Normal);

        gl.drawArrays(gl.TRIANGLES, 0, this.allVerts.length / 3);

        gl.deleteBuffer(vertexBuffer);
        gl.deleteBuffer(normalBuffer);
    }
}