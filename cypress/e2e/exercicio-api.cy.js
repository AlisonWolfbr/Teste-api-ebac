/// <reference types="cypress" />

describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
      expect(response.body.usuarios[0]).to.have.all.keys('_id', 'nome', 'email', 'password', 'administrador')
    })
  })

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: '/usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body.usuarios).to.be.an('array')
    })
  })

  it('Deve cadastrar um usuário com sucesso', () => {
    const email = `usuario${Math.floor(Math.random() * 100000)}@qa.com`

    cy.request({
      method: 'POST',
      url: '/usuarios',
      body: {
        nome: 'Usuário EBAC QA',
        email: email,
        password: 'teste',
        administrador: 'true'
      }
    }).should((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  })

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: '/usuarios',
      failOnStatusCode: false,
      body: {
        nome: 'Usuário inválido',
        email: 'invalido.com',
        password: 'teste',
        administrador: 'true'
      }
    }).should((response) => {
      expect(response.status).to.equal(400)
    })
  })

  it('Deve retornar erro ao cadastrar usuário com e-mail duplicado', () => {
    const email = `duplicado@qa.com`

    // Cria o primeiro usuário
    cy.cadastrarUsuario('Usuário Duplicado', email, '1234')

    // Tenta criar novamente com o mesmo e-mail
    cy.request({
      method: 'POST',
      url: '/usuarios',
      failOnStatusCode: false,
      body: {
        nome: 'Usuário Duplicado 2',
        email,
        password: '4321',
        administrador: 'false'
      }
    }).should((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.equal('Este email já está sendo usado')
    })
  })

  it('Deve editar um usuário previamente cadastrado', () => {
    const email = `editar${Math.floor(Math.random() * 10000)}@qa.com`

    cy.cadastrarUsuario('Usuário a Editar', email, '1234').then((response) => {
      const id = response.body._id

      cy.request({
        method: 'PUT',
        url: `/usuarios/${id}`,
        body: {
          nome: 'Usuário Editado',
          email: email,
          password: '4321',
          administrador: 'false'
        }
      }).should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })
  })

  it('Deve deletar um usuário previamente cadastrado', () => {
    const email = `deletar${Math.floor(Math.random() * 10000)}@qa.com`

    cy.cadastrarUsuario('Usuário para Deletar', email, '1234').then((response) => {
      const id = response.body._id

      cy.request({
        method: 'DELETE',
        url: `/usuarios/${id}`
      }).should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Registro excluído com sucesso')
      })
    })
  })
})

