import { Component } from '@angular/core';
import { FigmaService } from './services/figma.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Hello, angular';
  demo = {
    projectId: '36',
    fileKey: '',
    accessToken: '',
  };
  output = '';

  // PUBLIC_INTERFACE
  /** Handles demo form submission to call the Figma import API and display result. */
  async onSubmit(ev: any) {
    if (ev && typeof ev.preventDefault === 'function') {
      ev.preventDefault();
    }
    this.output = 'Sending...';
    try {
      const resp = await FigmaService.addFigmaData(this.demo.projectId, this.demo.fileKey, this.demo.accessToken);
      const text = await resp.text();
      this.output = `Status: ${resp.status}\n${text}`;
    } catch (e: any) {
      this.output = `Client error: ${e?.message || e}`;
    }
  }
}
