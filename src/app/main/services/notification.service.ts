import { Notifications } from '../interfaces/notifications.interface';
import { Injectable } from '@angular/core';
import { Observable ,  Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class NotificationsBusService {
 
  constructor(private toastr: ToastrService) { }

  showNotificacionSource: Subject<Notifications> = new Subject();
 
  getNotificacion(): Observable<Notifications> {
    return this.showNotificacionSource.asObservable();
  }
 
  showError(msg: string, summary?: string) {
    this.toastr.error(summary, msg, {
      positionClass: 'toast-bottom-right',
      progressBar: true
    }); 
  }
 
  showSuccess(msg: string, summary?: string) {
    this.toastr.success(summary, msg, {
      positionClass: 'toast-bottom-right',
      progressBar: true
    }); 
  }
  showInfo(msg: string, summary?: string) {
    this.toastr.info(summary, msg, {
      positionClass: 'toast-bottom-right',
      progressBar: true
    }); 
  }
  showWarn(msg :string, summary?: string) {
    this.toastr.warning(summary, msg, {
      positionClass: 'toast-bottom-right',
      progressBar: true
    }); 
  }
 
  private show(severity: string, summary: string, msg: string) {
    const notificacion: Notifications = {
      severity: severity,
      summary: summary,
      detail: msg
    };
 
    this.notify(notificacion);
  }

  private notify(notificacion: Notifications): void {
    this.showNotificacionSource.next(notificacion);
  }
 
}