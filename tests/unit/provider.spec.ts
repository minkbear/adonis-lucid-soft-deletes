/*
 * adonis-lucid-soft-deletes
 *
 * (c) Lookin Anton <alsd@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { compose } from '@adonisjs/core/helpers'
import { AppFactory } from '@adonisjs/core/factories/app'
import type { ApplicationService } from '@adonisjs/core/types'
import { column, BaseModel, ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { createDatabase, createTables } from '../helpers.js'
import { SoftDeletes } from '../../src/mixin.js'
import LucidSoftDeletesProvider from '../../providers/lucid_soft_deletes_provider.js'

const MACROS = ['withTrashed', 'onlyTrashed', 'restore']

test.group('LucidSoftDeletesProvider', () => {
  test('boot() registers `withTrashed` on the model query builder', async ({
    assert,
    cleanup,
    fs,
  }) => {
    /**
     * Macros live on a shared prototype and other groups register them in
     * setup, so they are removed here to prove they come from this boot().
     */
    const prototype = ModelQueryBuilder.prototype as any
    const registered = MACROS.map((name) => [name, prototype[name]])
    cleanup(() => {
      registered.forEach(([name, macro]) => (prototype[name] = macro))
    })
    MACROS.forEach((name) => delete prototype[name])
    assert.notProperty(prototype, 'withTrashed')

    const db = await createDatabase()
    await createTables(db)

    class User extends compose(BaseModel, SoftDeletes) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare username: string
    }
    User.boot()

    const [, trashed] = await User.createMany([{ username: 'alive' }, { username: 'trashed' }])
    await trashed.delete()

    const app = new AppFactory().create(fs.baseUrl, (filePath) => import(filePath))
    await new LucidSoftDeletesProvider(app as ApplicationService).boot()

    const visible = await User.query().orderBy('id')
    const all = await User.query().withTrashed().orderBy('id')

    assert.deepEqual(
      visible.map(({ username }) => username),
      ['alive']
    )
    assert.deepEqual(
      all.map(({ username }) => username),
      ['alive', 'trashed']
    )
  })
})

test.group('SoftDeletes static helpers', () => {
  test('`withTrashed` resolves to instances of the calling model', async ({ assert }) => {
    const db = await createDatabase()
    await createTables(db)

    class User extends compose(BaseModel, SoftDeletes) {
      @column({ isPrimary: true })
      declare id: number

      @column()
      declare username: string
    }
    User.boot()

    await User.create({ username: 'alive' })

    const users = await User.withTrashed()
    assert.deepEqual(
      users.map(({ username }) => username),
      ['alive']
    )
  })
})
