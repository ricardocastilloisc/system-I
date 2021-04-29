export class Usuario {

    static fromAmplify({ email, name, groups, attributes }) {
        return new Usuario(name, email, groups, attributes);
    }

    constructor(
        public name: string,
        public email: string,
        public groups: any[],
        public attributes: any

    ) { }


}
