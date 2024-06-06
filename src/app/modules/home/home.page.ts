import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner, LensFacing, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { BrowserBarcodeReader, Result } from '@zxing/library';
import { DialogService } from 'src/app/core';
import { BarcodeScannerModalComponent } from '../barcode-scanner-modal/barcode-scanner-modal.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
//for browser
  // isSupported = true; // Assuming zxing-js/library is supported on all platforms
  // barcodes: string[] = [];

  // constructor() { }

  // ngOnInit() { }

  // async scan(): Promise<void> {
  //   const codeReader = new BrowserBarcodeReader();
  //   try {
  //     const result: Result = await codeReader.decodeFromInputVideoDevice(undefined, 'video');
  //     console.log('Scanned barcode:', result);
  //     this.barcodes.push(result.getText());
  //   } catch (err) {
  //     console.error('Barcode scanning error:', err);
  //     // Handle the error
  //   }
  // }

  // for mobile

  isSupported = false;
  barcodes: Barcode[] = [];
  public isPermissionGranted = false;

  constructor(private readonly dialogService: DialogService,) { }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    BarcodeScanner.checkPermissions().then((result) => {
      this.isPermissionGranted = result.camera === 'granted';
    });
  }


  public async startScan(): Promise<void> {
    const lensFacing = LensFacing.Back;
    const element = await this.dialogService.showModal({
      component: BarcodeScannerModalComponent,
      // Set `visibility` to `visible` to show the modal (see `src/theme/variables.scss`)
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        lensFacing: lensFacing,
      },
    });
    element.onDidDismiss().then((result) => {
      const barcode: Barcode | undefined = result.data?.barcode;
      if (barcode) {
        this.barcodes = [barcode];
      }
    });
  }

}
