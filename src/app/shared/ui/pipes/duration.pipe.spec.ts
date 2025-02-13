import {DurationPipe} from './duration.pipe';

describe('DurationPipe', () => {
    const pipe = new DurationPipe();

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format seconds to h:m:ss:ms', () => {
        expect(pipe.transform(1000)).toBe('16 min 40 sec');
        expect(pipe.transform(5000)).toBe('1 h 23 min 20 sec');
        expect(pipe.transform(0)).toBe(null);
        expect(pipe.transform(-500)).toBe(null);
        expect(pipe.transform(null)).toBe(null);
    });
});
