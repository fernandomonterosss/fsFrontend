import { Directive,ElementRef,Renderer } from '@angular/core';


@Directive({
  selector: '[appuser]'
})

export class UserDirective {

  constructor(
    public el:ElementRef,
    public renderer:Renderer
  ) { }

  ngOnInit(){
  
    this.renderer.setElementStyle(this.el.nativeElement,"color","red")
      
  }

  settext(){
     // this.el.nativeElement.innerText=valor;
  }
}
