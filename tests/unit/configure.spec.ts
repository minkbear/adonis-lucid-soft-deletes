/*
 * adonis-lucid-soft-deletes
 *
 * (c) Lookin Anton <alsd@lookinlab.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { AceFactory } from '@adonisjs/core/factories/core/ace'
import Configure from '@adonisjs/core/commands/configure'

const PACKAGE_NAME = '@minkbear/adonis-lucid-soft-deletes'

const ADONISRC = `import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  providers: [() => import('@adonisjs/core/providers/app_provider')],
})
`

test.group('configure', () => {
  test('registers the scoped provider in adonisrc.ts', async ({ assert, fs }) => {
    await fs.create('adonisrc.ts', ADONISRC)
    await fs.createJson('tsconfig.json', { compilerOptions: {} })

    const ace = await new AceFactory().make(fs.baseUrl, {
      importer: (filePath) =>
        filePath === PACKAGE_NAME ? import('../../index.js') : import(filePath),
    })
    ace.ui.switchMode('raw')

    const command = await ace.create(Configure, [PACKAGE_NAME])
    await command.exec()

    assert.equal(command.exitCode, 0)
    await assert.fileContains('adonisrc.ts', `import('${PACKAGE_NAME}/provider')`)
    await assert.fileContains('adonisrc.ts', `import('@adonisjs/core/providers/app_provider')`)
  })
})
