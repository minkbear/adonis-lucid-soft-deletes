/*
 * adonis-lucid-soft-deletes
 *
 * (c) Lookin Anton <alsd@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Exception } from '@adonisjs/core/exceptions'
import { BaseModel, ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { createDatabase } from '../helpers.js'
import { extendModelQueryBuilder } from '../../src/bindings/model_query_builder.js'

test.group('Model without SoftDeletes', (group) => {
  group.setup(() => {
    extendModelQueryBuilder(ModelQueryBuilder)
  })

  test('query().{$self}() throws E_MODEL_SOFT_DELETE')
    .with(['withTrashed', 'onlyTrashed'] as const)
    .run(async ({ assert }, method) => {
      await createDatabase()

      class Plain extends BaseModel {}
      Plain.boot()

      let error: any
      try {
        ;(Plain.query() as any)[method]()
      } catch (thrown) {
        error = thrown
      }

      assert.instanceOf(error, Exception)
      assert.equal(error.code, 'E_MODEL_SOFT_DELETE')
      assert.equal(error.status, 500)
      assert.equal(error.message, `Plain model don't support Soft Deletes`)
    })
})
