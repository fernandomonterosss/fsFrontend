import { Component, OnInit } from '@angular/core';
import {navigation} from '../../navigation/navigation'
import {AuthenticationService} from '../services/authentication.service'
import { FuseNavHorizontalItemComponent } from '@fuse/components/navigation/horizontal/item/item.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService ) { }

  ngOnInit() {
   let rol=this.authenticationService._rol()

      if (parseInt(rol)==1||parseInt(rol)==4){
        navigation[0].children[2].hidden=true
        navigation[0].children[3].hidden=true
      }else
      if (parseInt(rol)==3){
        navigation[0].children[2].hidden=true
        navigation[0].children[1].hidden=true
      }
      else 
      if (parseInt(rol)==2){
        if (navigation[0].children[2].hidden==true)
          navigation[0].children[2].hidden=false
        if (navigation[0].children[3].hidden==true)
          navigation[0].children[3].hidden=false
      }

  }

}
