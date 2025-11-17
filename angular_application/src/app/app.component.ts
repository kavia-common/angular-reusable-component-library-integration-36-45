import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Hello, angular';

  // PUBLIC_INTERFACE
  /** No-op kept to preserve previous public API surface if referenced elsewhere. */
  async onSubmit(_ev: any) { /* deprecated in new layout */ }
}
