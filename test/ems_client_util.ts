/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { EMSClient } from '../src';
import fetch from 'node-fetch';

import EMS_CATALOGUE from './ems_mocks/sample_manifest.json';
import EMS_FILES from './ems_mocks/sample_files.json';
import EMS_TILES from './ems_mocks/sample_tiles.json';
import EMS_STYLE_ROAD_MAP_BRIGHT from './ems_mocks/sample_style_bright.json';
import EMS_STYLE_BRIGHT_PROXIED from './ems_mocks/sample_style_bright_proxied.json';
import EMS_STYLE_BRIGHT_VECTOR_PROXIED from './ems_mocks/sample_style_bright_vector_proxied.json';

import EMS_STYLE_ROAD_MAP_DESATURATED from './ems_mocks/sample_style_desaturated.json';
import EMS_STYLE_DARK_MAP from './ems_mocks/sample_style_dark.json';

import EMS_STYLE_ROAD_MAP_BRIGHT_VECTOR from './ems_mocks/sample_style_bright_vector.json';
import EMS_STYLE_ROAD_MAP_BRIGHT_VECTOR_SOURCE from './ems_mocks/sample_style_bright_vector_source.json';
import EMS_STYLE_ROAD_MAP_BRIGHT_VECTOR_SOURCE_PROXIED from './ems_mocks/sample_style_bright_vector_source_proxied.json';

import EMS_CATALOGUE_PROXIED from './ems_mocks/sample_manifest_proxied.json';
import EMS_FILES_PROXIED from './ems_mocks/sample_files_proxied.json';
import EMS_TILES_PROXIED from './ems_mocks/sample_tiles_proxied.json';

export function getEMSClient(options = {}) {
  const emsClient = new EMSClient({
    language: 'en',
    appVersion: '7.x.x',
    appName: 'tester',
    landingPageUrl: 'https://landing.foobar',
    fetchFunction: fetch,
    tileApiUrl: 'http://tile.foo',
    fileApiUrl: 'http://file.foo',
    ...options,
  });

  emsClient.getManifest = async (url: string): Promise<any> => {
    //simulate network calls
    if (url.startsWith('https://foobar')) {
      return EMS_CATALOGUE;
    } else if (url.startsWith('https://tiles.foobar')) {
      if (url.includes('/manifest')) {
        return EMS_TILES;
      } else if (url.includes('osm-bright/style.json')) {
        return EMS_STYLE_ROAD_MAP_BRIGHT_VECTOR;
      } else if (url.includes('osm-bright-desaturated.json')) {
        return EMS_STYLE_ROAD_MAP_DESATURATED;
      } else if (url.includes('osm-bright.json')) {
        return EMS_STYLE_ROAD_MAP_BRIGHT;
      } else if (url.includes('dark-matter.json')) {
        return EMS_STYLE_DARK_MAP;
      } else if (url.includes('/data/v3.json')) {
        return EMS_STYLE_ROAD_MAP_BRIGHT_VECTOR_SOURCE;
      }
    } else if (url.startsWith('https://files.foobar')) {
      return EMS_FILES;
    } else if (url.startsWith('http://proxy.com/foobar/manifest')) {
      return EMS_CATALOGUE_PROXIED;
    } else if (url.startsWith('http://proxy.com/foobar/vector')) {
      return EMS_FILES_PROXIED;
    } else if (url.startsWith('http://proxy.com/foobar/tiles')) {
      if (url.includes('manifest')) {
        return EMS_TILES_PROXIED;
      } else if (url.includes('/data/v3.json')) {
        return EMS_STYLE_ROAD_MAP_BRIGHT_VECTOR_SOURCE_PROXIED;
      } else if (url.includes('osm-bright.json')) {
        return EMS_STYLE_BRIGHT_PROXIED;
      } else if (url.includes('osm-bright/style.json')) {
        return EMS_STYLE_BRIGHT_VECTOR_PROXIED;
      }
    } else {
      throw new Error(`url unexpected: ${url}`);
    }
  };
  return emsClient;
}
