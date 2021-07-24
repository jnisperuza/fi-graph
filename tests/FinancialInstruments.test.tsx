// @ts-ignore
import { React } from 'jimu-core';
// @ts-ignore
import { widgetRender, wrapWidget } from 'jimu-for-test';
import _Widget from '../src/runtime/FinancialInstruments';

const render = widgetRender();
describe('Financial instruments widget', () => {
  it('should create', () => {
    const Widget = wrapWidget(_Widget);
    const component = render(<Widget widgetId="Widget_1" />);
    expect(component).toBeTruthy();
  })
});