import {Injectable, Inject, inject} from '@angular/core';

@Injectable({
  providedIn: 'root',
})


export class SharedService {

  textFromClipboard: any;

  constructor() {
  }


  sortDeleted(list: any) {
    const nonDeleted: any[] = [];
    const deleted: any[] = [];
    list.forEach((data: any) => {
      if (!data.deleted) {
        nonDeleted.push(data);
      } else {
        deleted.push(data);
      }
    });
    return nonDeleted.concat(deleted);
  }

  copyToClipboard(text: any) {
    // this.clipboardApi.copyFromContent(text);
    this.textFromClipboard = text;
    this.showToast('success', 'Ενημέρωση', 'Έγινε αντιγραφή του κειμένου');
  }

  showToast(type:any, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 3000,
      hasIcon: true,
      // position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: true,
    };
    // this.toastrService.show(body, title, config);
  }

}
