import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario-service';
import { Router } from '@angular/router'; 

interface sexo{
  label:String,
  value:String;
}


@Component({
  selector: 'app-cadastro-usuario-bootstrap',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cadastro-usuario.html',
  styleUrl: './cadastro-usuario.css'
})
export class CadastroUsuario implements OnInit {
  nome!: string;
  email!: string;
  senha!: string;
  cpf!: string;
  sexo!: sexo;
  profissao!: string;
  renda!: number;
  data_nascimento!: Date;

  opcoesSexo:sexo[]=[
    {label: 'Masculino', value:'M'},
    {label: 'Feminino', value:'F'},
    {label: 'Outro', value:'O'}

  ]

  constructor(private readonly usuarioService: UsuarioService, 
    private router: Router){}

  ngOnInit(): void {}

  onSubmit():void{
    const dadosCadastro = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      cpf: this.cpf,
      sexo: this.sexo.value,
      profissao: this.profissao,
      renda: this.renda,
      data_nascimento: this.data_nascimento
    };

    this.usuarioService.CadastroUsuario(dadosCadastro).subscribe({
      next:(response) =>{
        console.log('Cadastro realizado com sucesso!',response);
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/home']);
        
      },
      error:(error) =>{
        console.error('Erro ao cadastrar', error)
        alert('Erro ao cadastrar')
      }

    })
  }

}
