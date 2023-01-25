import pkg from '../package.json' assert { type: "json" };

const { author, homepage, license, name, version } = pkg;

export default `/**!
 * ${name}
 * @version: ${version}
 * @author: ${author}
 * @url: ${homepage}
 * @license: ${license}
 */
`;
