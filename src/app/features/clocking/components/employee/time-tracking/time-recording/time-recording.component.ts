import {Component, signal} from '@angular/core';
import {Card} from "primeng/card";
import {InputMask} from "primeng/inputmask";
import {InputText} from "primeng/inputtext";
import {Select} from "primeng/select";
import {Textarea} from "primeng/textarea";
import {getWorkEntryKinds} from "../../../../clocking.utils";

@Component({
  selector: 'app-time-recording',
  imports: [
    Card,
    InputMask,
    InputText,
    Select,
    Textarea
  ],
  templateUrl: './time-recording.component.html',
  styleUrl: './time-recording.component.scss'
})
export class TimeRecordingComponent {
  protected readonly workEntryKinds$ = signal<string[]>(getWorkEntryKinds());
}
