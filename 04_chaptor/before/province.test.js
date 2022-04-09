import { Province, sampleProvinceData } from './province'
import assert from "assert";

describe('province', () => {
  it('shortfail', () => {
      const asia = new Province(sampleProvinceData());
      assert.equal(asia.shortfall, 5)
  })
})