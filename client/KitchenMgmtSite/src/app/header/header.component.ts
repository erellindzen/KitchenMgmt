import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';
import { KmwsService } from '../kmws.service';
import { Nav } from '../custom_models/nav';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private navLinkActive = 1;
  private navs: Array<Nav> = [];

  constructor(private auth: AuthService, private router: Router, private kmws: KmwsService ) { }

  ngOnInit() {
    this.kmws.getNavs()
      .subscribe(
        data => {
          (data.body as Array<Nav>).sort((a, b) => a.id - b.id).forEach(nav => this.navs.push(nav));
        },
        error => this.navs = []
      );
  }

  logout(){
    this.auth.logout()
    .subscribe(isLoggedOut => {
      if(isLoggedOut){
        this.router.navigateByUrl('/welcome');
      }
    });
  }

  changeLink(navNum: number){
    this.navLinkActive = navNum;
    if(this.navs.map(nav => nav.id).includes(this.navLinkActive)){
      this.router.navigateByUrl(this.navs.filter(nav => nav.id === this.navLinkActive)[0].navigation);
    }else{
      this.router.navigateByUrl('/welcome');
    }
  }

  private checkIfActive(navigation){
    if(this.router.url === navigation){
      return true;
    }

    if(navigation == '/main-menu' && this.router.url.search("/dishes") > 0){
      return true;
    }

    return false;
  }

}
