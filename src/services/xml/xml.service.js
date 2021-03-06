import { create } from 'xmlbuilder2';
import _ from 'lodash';

export default {
  /**
   * Create an xml starting from a single object
   * @param object
   * @returns {Promise<string>}
   */
  createXmlFromObject: async (object) => {
    const { start, end } = object;

    const doc = create({ version: '1.0', encoding: 'UTF-8' })
      // .ele('root', { att: 'val' })
      .ele('root')
      .ele('field1')
      .ele('field2')
      .txt('field2_value')
      .up()
      .ele('field3')
      .txt('field3_value')
      .up()
      .ele('start')
      .txt(new Intl.DateTimeFormat('it-IT').format(start))
      .up()
      .ele('end')
      .txt(new Intl.DateTimeFormat('it-IT').format(end))
      .up()
      .doc();

    if (doc) {
      // If wanna return json instead of xml
      // console.log(doc.end({ format: 'json', prettyPrint: true }));

      return doc.end({ prettyPrint: true });
    }
  },
  /**
   * Create an xml iterating over an array of objects
   * @return {Promise<string>}
   * @param arrayObject
   */
  createXmlFromAnArray: async (arrayObject) => {
    // This should be the arrayObject passed
    // const arrayExample = [
    //   {
    //     field1: '12345',
    //     field2: 'ASDFG',
    //   },
    //   {
    //     field1: '67890',
    //     field2: 'QWERTY',
    //   },
    //   {
    //     field1: '192837',
    //     field2: 'ZXCVB',
    //   },
    // ];

    const doc = create({ version: '1.0', encoding: 'UTF-8' })
      // .ele('root', { att: 'val' })
      .ele('root')
      .ele('field1')
      .ele('field2')
      .txt('field2_value')
      .up()
      .ele('field3')
      .txt('field3_value')
      .up();

    doc.com('Iterator over array');

    _.forEach(arrayObject, (value, key) => {
      doc
        .ele(`field${key + 1}`)
        .txt(value.field2)
        .up()
        .ele(`field${key + 1}`)
        .txt(value.field2)
        .up();
    });

    doc.doc();

    if (doc) {
      // console.log(doc.end({ prettyPrint: true }));
      return doc.end({ prettyPrint: true });
    }
  },
};
