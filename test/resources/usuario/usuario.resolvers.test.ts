import * as jwt from 'jsonwebtoken';

import { app, db, chai, handleError, expect } from './../../test-utils';
import { UsuarioInstance } from '../../../src/models/UsuarioModel';
import { JWT_SECRET } from '../../../src/utils/utils';

describe('Usuario', () => {

    let token: string;
    let userId: number;

    beforeEach(() => {
        return db.Premios.destroy({where: {}})
            .then((rows: number) => db.Empresa.destroy({where: {}}))
            .then((rows: number) => db.Usuario.destroy({where: {}}))
            .then((rows: number) => db.Usuario.bulkCreate([
                {
                    nomeUsuario: 'Peter Quill',
                    email: 'peter@guardians.com',
                    senha: '1234'
                },
                {
                    nomeUsuario: 'Gamora',
                    email: 'gamora@guardians.com',
                    senha: '1234'
                },
                {
                    nomeUsuario: 'Groot',
                    email: 'groot@guardians.com',
                    senha: '1234'
                },
                {
                    nomeUsuario: 'Rocket',
                    email: 'rocket@guardians.com',
                    senha: '1234'
                }

            ])).then((users: UsuarioInstance[]) => {
                userId = users[0].get('id');
                console.log("ID DO USUARIO-------------------> ",userId);
                const payload = {sub: userId};
                token = jwt.sign(payload, JWT_SECRET);
            });
    });

    describe('Queries', () => {

        describe('application/json', () => {

            describe('usuarios', () => {

                it('should return a list of Usuario', () => {

                    let body = {
                        query: `
                            query {
                                listarUsuarios {
                                    nomeUsuario
                                    email
                                }
                            }
                        `
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            console.log(res.body.data);
                            const usersList = res.body.data.listarUsuarios;
                            console.log("OBJ======> ",usersList);
                            expect(res.body.data).to.be.an('object');
                            expect(usersList).to.be.an('array');
                            expect(usersList[0]).to.not.have.keys(['id','nome','sobrenome','sexo','pontuacao','dataNasc','cpf','tipoLogin', 'fotoUsuario', 'createdAt', 'updatedAt', 'idEmpresa','cargo'])
                            expect(usersList[0]).to.have.keys(['nomeUsuario', 'email']);
                        }).catch(handleError);

                });

                it('should paginate a list of Usuarios', () => {
                    
                    let body = {
                        query: `
                            query getUsersList($first: Int, $offset: Int) {
                                listarUsuarios(first: $first, offset: $offset) {
                                    nomeUsuario
                                    email
                                    createdAt
                                }
                            }
                        `,
                        variables: {
                            first: 2,
                            offset: 1
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const usersList = res.body.data.listarUsuarios;
                            expect(res.body.data).to.be.an('object');
                            expect(usersList).to.be.an('array').of.length(2);
                            expect(usersList[0]).to.not.have.keys(['id','nome','sobrenome','sexo','pontuacao','dataNasc','cpf','tipoLogin', 'fotoUsuario','updatedAt', 'idEmpresa','cargo'])
                            expect(usersList[0]).to.have.keys(['nomeUsuario', 'email', 'createdAt']);
                        }).catch(handleError);

                });

            });

            describe('usuario', () => {

                it('should return a single Usuario', () => {
                    
                    let body = {
                        query: `
                            query getUsuarioById($id: ID!) {
                                listarUsuario(id: $id) {
                                    id
                                    nomeUsuario
                                    email
                                }
                            }
                        `,
                        variables: {
                            id: userId
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            console.log("res.body.data -------------------> ",res.body.data);

                            const singleUser = res.body.data.listarUsuario;
                            expect(res.body.data).to.be.an('object');
                            expect(singleUser).to.be.an('object');
                            expect(singleUser).to.have.keys(['id','nomeUsuario', 'email']);
                            expect(singleUser.nomeUsuario).to.equal('Peter Quill');
                            expect(singleUser.email).to.equal('peter@guardians.com');
                        }).catch(handleError);

                });

                it('should return only \'nomeUsuario\' attribute', () => {
                    
                    let body = {
                        query: `
                            query getSingleUser($id: ID!) {
                                listarUsuario(id: $id) {
                                    nomeUsuario
                                }
                            }
                        `,
                        variables: {
                            id: userId
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const singleUser = res.body.data.listarUsuario;
                            expect(res.body.data).to.be.an('object');
                            expect(singleUser).to.be.an('object');
                            expect(singleUser).to.have.key('nomeUsuario')
                            expect(singleUser.nomeUsuario).to.equal('Peter Quill');
                            expect(singleUser.email).to.be.undefined;
                            expect(singleUser.createdAt).to.be.undefined;
                            expect(singleUser.idEmpresa).to.be.undefined;
                        }).catch(handleError);

                });

                it('should return an error if Usuario not exists', () => {
                    
                    let body = {
                        query: `
                            query getSingleUser($id: ID!) {
                                listarUsuario(id: $id) {
                                    nomeUsuario
                                    email
                                }
                            }
                        `,
                        variables: {
                            id: -1
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            expect(res.body.data.listarUsuario).to.be.null;
                            expect(res.body.errors).to.be.an('array');
                            expect(res.body).to.have.keys(['data', 'errors']);
                            expect(res.body.errors[0].message).to.equal('Error: Usuário com o id -1 não foi encontrado!');
                        }).catch(handleError);

                });


            });

            describe('currentUser', () => {

                it('should return the User owner of the token', () => {
                    
                    let body = {
                        query: `
                            query {
                                currentUser {
                                    nomeUsuario
                                    email
                                }
                            }
                        `
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {
                            const currentUser = res.body.data.currentUser;
                            console.log("currentUser---------------------> ",currentUser);
                            expect(currentUser).to.be.an('object');
                            expect(currentUser).to.have.keys(['nomeUsuario', 'email']);
                            expect(currentUser.nomeUsuario).to.equal('Peter Quill');
                            expect(currentUser.email).to.equal('peter@guardians.com');
                        }).catch(handleError);

                });

            });

        });

    });


    describe('Mutations', () => {

        describe('application/json', () => {
            
            describe('adicionarUsuario', () => {

                it('should create new Usuario', () => {

                    let body = {
                        query: `
                            mutation createNewUser($input: UsuarioCreateInput!) {
                                adicionarUsuario(input: $input) {
                                    id
                                    nomeUsuario
                                    email
                                    cpf
                                }
                            }
                        `,
                        variables: {
                            input: {
                                nomeUsuario: 'Drax',
                                email: 'drax@guardians.com',
                                senha: '1234',
                                cpf:"112-156-190-10"
                            }
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .send(JSON.stringify(body))
                        .then(res => {
                            const createdUser = res.body.data.adicionarUsuario;
                            expect(createdUser).to.be.an('object');
                            expect(createdUser.nomeUsuario).to.equal('Drax');
                            expect(createdUser.email).to.equal('drax@guardians.com');
                            expect(createdUser.cpf).to.equal('112-156-190-10');
                            expect(parseInt(createdUser.id)).to.be.a('number');
                        }).catch(handleError);

                });

            });

            describe('editarUsuario', () => {
                
                it('should update an existing Usuario', () => {

                    let body = {
                        query: `
                            mutation updateExistingUser($id:ID!,$input: UsuarioUpdateInput!) {
                                editarUsuario(id:$id,input: $input) {
                                    nomeUsuario
                                    email
                                    fotoUsuario
                                }
                            }
                        `,
                        variables: {
                            id:userId,
                            input: {
                                nomeUsuario: 'Star Lord',
                                email: 'peter@guardians.com',
                                fotoUsuario: 'some_photo'
                            }
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {
                            const updatedUser = res.body.data.editarUsuario;
                            expect(updatedUser).to.be.an('object');
                            expect(updatedUser.nomeUsuario).to.equal('Star Lord');
                            expect(updatedUser.email).to.equal('peter@guardians.com');
                            expect(updatedUser.fotoUsuario).to.not.be.null;
                            expect(updatedUser.id).to.be.undefined;
                        }).catch(handleError);

                });

                it('should block operation if token is invalid', () => {
                    
                    let body = {
                        query: `
                            mutation updateExistingUser($id:ID!,$input: UsuarioUpdateInput!) {
                                editarUsuario(id:$id,input: $input) {
                                    nomeUsuario
                                    email
                                    fotoUsuario
                                }
                            }
                        `,
                        variables: {
                            id:userId,
                            input: {
                                nomeUsuario: 'Star Lord',
                                email: 'peter@guardians.com',
                                fotoUsuario: 'some_photo'
                            }
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', 'Bearer INVALID_TOKEN')
                        .send(JSON.stringify(body))
                        .then(res => {
                            expect(res.body.data.editarUsuario).to.be.null;
                            expect(res.body).to.have.keys(['data', 'errors']);
                            expect(res.body.errors).to.be.an('array');
                            expect(res.body.errors[0].message).to.equal('JsonWebTokenError: jwt malformed');
                        }).catch(handleError);

                });

            });

            describe('editarSenhaUsuario', () => {

                it('should update the password of an existing Usuario', () => {
                    
                    let body = {
                        query: `
                            mutation updateUserPassword($input: UsuarioUpdateSenhaInput!) {
                                editarSenhaUsuario(input: $input)
                            }
                        `,
                        variables: {
                            input: {
                                senha: 'peter123'
                            }
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {
                            expect(res.body.data.editarSenhaUsuario).to.be.true;
                        }).catch(handleError);

                });

            });

            describe('excluirUsuario', () => {
                
                it('should delete an existing Usuario', () => {
                    
                    let body = {
                        query: `
                            mutation ($id:ID!){
                                excluirUsuario(id:$id)
                            }
                        `,
                        variables: {
                            id: userId
                        }
                    };

                    return chai.request(app)
                        .post('/graphql')
                        .set('content-type', 'application/json')
                        .set('authorization', `Bearer ${token}`)
                        .send(JSON.stringify(body))
                        .then(res => {
                            expect(res.body.data.excluirUsuario).to.be.true;
                        }).catch(handleError);

                });

                // it('should block operation if token is not provided', () => {
                    
                //     let body = {
                //         query: `
                //             mutation ($id:ID!){
                //                 excluirUsuario(id:$id)
                //             }
                //         `,
                //         variables: {
                //             id: userId
                //         }
                //     };

                //     return chai.request(app)
                //         .post('/graphql')
                //         .set('content-type', 'application/json')
                //         .send(JSON.stringify(body))
                //         .then(res => {
                //             console.log("res.body.erros-------------------------> ",res.body);
                //             expect(res.body.errors[0].message).to.equal('Unauthorized! Token not provided!');
                //         }).catch(handleError);

                // });

            });
            
        });

    });

});