import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import { attr as svgAttr } from 'tiny-svg';
import EventBus from 'diagram-js/lib/core/EventBus';
import Styles from 'diagram-js/lib/draw/Styles';
import { ModdleElement } from 'bpmn-js/lib/util/ModelUtil';
import { Connection, Shape } from 'bpmn-js/lib/model/Types';
import BpmnRenderer, { Attrs } from 'bpmn-js/lib/draw/BpmnRenderer';

const HIGH_PRIORITY = 2000;

export class CustomRenderer extends BaseRenderer {
  constructor(private eventBus: EventBus, private styles: Styles, private bpmnRenderer: BpmnRenderer) {
    super(eventBus, HIGH_PRIORITY);
  }

  override canRender(element: Shape): boolean {
    return this.isBpmnElement(element);
  }

  override drawShape(parentGfx: SVGElement, shape: Shape, attrs?: Attrs): SVGElement {
    const shapeGfx = this.bpmnRenderer.drawShape(parentGfx, shape, attrs);
    const businessObject = shape.businessObject as ModdleElement;
    console.log(businessObject.$type);
    switch (businessObject.$type) {
      case 'bpmn:StartEvent':
        svgAttr(shapeGfx, {stroke: '#33aa33', fill: '#ddffdd'});
        break;
      case 'bpmn:EndEvent':
        svgAttr(shapeGfx, {stroke: '#f43041', fill: '#f4cdd1'});
        break;
      case 'bpmn:ExclusiveGateway':
        svgAttr(shapeGfx, {stroke: '#cc6600', fill: '#fff2e6'});
        break;
      case 'bpmn:ParallelGateway':
        svgAttr(shapeGfx, {stroke: '#0066cc', fill: '#e6f2ff'});
        break;
      case 'bpmn:InclusiveGateway':
        svgAttr(shapeGfx, {stroke: '#990099', fill: '#f3e6ff'});
        break;
      default:
        svgAttr(shapeGfx, {stroke: '#1e90ff', fill: '#e6f0ff'});// fallback
    }
    return shapeGfx;
  }

  override drawConnection(parentGfx: SVGElement, connection: Connection, attrs?: Attrs): SVGElement {
    const connectionGfx = this.bpmnRenderer.drawConnection(parentGfx, connection, attrs);
    const businessObject = connection.businessObject as ModdleElement;

    if (businessObject.$type === 'bpmn:SequenceFlow') {
      svgAttr(connectionGfx, {stroke: '#b5d4f6', strokeWidth: '2px', markerEnd: 'url(#custom-sequenceflow-arrow)'});
    } else {
      svgAttr(connectionGfx, {stroke: '#888', strokeDasharray: '4,2'});
    }

    return connectionGfx;
  }


  private isBpmnElement(element: Shape): boolean {
    return typeof element?.businessObject?.$type === 'string' && element.businessObject.$type.startsWith('bpmn:');
  }
}
