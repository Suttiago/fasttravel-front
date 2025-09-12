import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuario-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Adicione standalone: true
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email!: string;
  senha!: string;

  constructor(private readonly usuarioService: UsuarioService,
    private router: Router) {}

  onSubmit(): void {
    const dadosLogin = {
      email: this.email,
      senha: this.senha
    };

    this.usuarioService.LoginUsuario(dadosLogin).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access_token);
        
        console.log('Login realizado com sucesso', response);
        this.router.navigate(['/home']);
      },

      error: (error) => {
        console.error('Erro de login', error);
        alert('Email ou senha incorretos');
      }
    });
  }
}