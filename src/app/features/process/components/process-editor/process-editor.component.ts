import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import BpmnJS from 'bpmn-js/lib/Modeler';
import type Canvas from 'diagram-js/lib/core/Canvas';
import { CustomRenderer } from '../../utils/custom-renderer';
import { ButtonDirective } from 'primeng/button';
import EventBus from 'diagram-js/lib/core/EventBus';
import { Shape } from 'bpmn-js/lib/model/Types';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-process-editor',
  imports: [
    ButtonDirective
  ],
  templateUrl: './process-editor.component.html',
  styleUrl: './process-editor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProcessEditorComponent implements AfterViewInit {
  @ViewChild('canvas', {static: true}) private canvasRef!: ElementRef;
  @ViewChild('properties', {static: true}) propertiesRef!: ElementRef;

  private bpmnJS!: BpmnJS;
  protected selection = signal<Shape | undefined>(undefined);
  protected name = computed(() => this.selection() ? this.selection()!.businessObject.name : 'No selection');

  private http = inject(HttpClient);

  ngAfterViewInit() {
    this.bpmnJS = new BpmnJS({
      container: '',
      additionalModules: [
        {
          __init__: ['customRenderer'],
          customRenderer: ['type', CustomRenderer]
        }
      ]
    });
    const eventBus: EventBus = this.bpmnJS.get('eventBus');
    eventBus.on('selection.changed', (event: { oldSelection: Shape[]; newSelection: Shape[] }) => {
      const selectedElements: Shape[] = event.newSelection;
      if (selectedElements && selectedElements.length > 0) {
        if (selectedElements.length == 1) {
          /* single selection */
          this.onSingleSelection(selectedElements[0]);
        } else {
          /* multi selection */
        }
      } else {
        /* no selection */
        this.onClearSelection();
      }
    });

    this.initModel();
  }

  private onSingleSelection(element: Shape) {
    this.selection.set(element);
  }

  private onClearSelection() {
    this.selection.set(undefined);
  }

  initModel(): void {
    this.bpmnJS.attachTo(this.canvasRef.nativeElement);

    this.http.get('assets/example.bpmn', {responseType: 'text'})
      .subscribe(async (xml: string) => {
        this.bpmnJS.importXML(xml).then(() => {
          const canvas: Canvas = this.bpmnJS.get('canvas');
          canvas.zoom('fit-viewport');

          const svg = canvas.getContainer().querySelector('svg');
          if (!svg) return;

          let defs = svg?.querySelector('defs');
          if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svg.insertBefore(defs, svg.firstChild); // insert at top of SVG
          }


          const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
          marker.id = 'custom-sequenceflow-arrow';
          marker.setAttribute('viewBox', '0 0 20 20');
          marker.setAttribute('refX', '11');
          marker.setAttribute('refY', '10');
          marker.setAttribute('markerWidth', '10');
          marker.setAttribute('markerHeight', '10');
          marker.setAttribute('orient', 'auto');

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M 1 5 L 11 10 L 1 15 Z');
          path.setAttribute('fill', '#b5d4f6');
          path.setAttribute('stroke', '#b5d4f6');
          path.setAttribute('stroke-width', '1');

          marker.appendChild(path);
          defs.appendChild(marker);

        }).catch(err => {
          console.error('Error rendering BPMN diagram:', err);
        });
      });


  }

  onSave() {
    this.bpmnJS.saveXML({format: true}).then(({xml}) => {
      console.log(xml);
    });
  }
}
