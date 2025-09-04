import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario-service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-listar-usuario',
  imports: [TableModule,ButtonModule],
  templateUrl: './listar-usuario.html',
  styleUrl: './listar-usuario.css'
})

export class ListarUsuario implements OnInit {

  usuarios:any[] = [];

  constructor(private readonly usuarioService: UsuarioService, private readonly detectorMudanca:ChangeDetectorRef){

  }

  ngOnInit():void{
    this.usuarioService.listarUsuarios().subscribe({
      next:(ListarUsuario:any[])=>{
        this.usuarios = ListarUsuario;
        console.log(this.usuarios)
        this.detectorMudanca.detectChanges();
      },
      error: error=>{
        console.log("erro ao buscar clientes");
        console.log(error)
      }

    });
  }

}
