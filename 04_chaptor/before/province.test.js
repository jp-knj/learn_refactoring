import { Province, sampleProvinceData } from './province'
import assert from "assert";

describe('province', () => {
    let asia;
    beforeEach(() => {
        asia = new Province(sampleProvinceData());
    })

  it('shortfail', () => {
      const asia = new Province(sampleProvinceData());
      expect(asia.shortfall).toEqual(5);
  })
    it('profit', () => {
        const asia = new Province(sampleProvinceData());
        expect(asia.profit).toEqual(230);
    })
})