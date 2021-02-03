import { Participant, ParticipantType } from 'types'
import Convict from 'convict'
import PACKAGE from '../package.json'
import fs, { PathLike } from 'fs'
import path from 'path'
import SDKStandardComponents from '@mojaloop/sdk-standard-components'
import {TCurrency} from '@mojaloop/sdk-standard-components'

export { PACKAGE }


export interface GlobalConfig {
  currency: SDKStandardComponents.TCurrency,
  // Urls to talk to services
  urls: {
    fspiop: string,
    // als: string, //don't think we need this...
    alsAdmin: string,
    centralLedgerAdmin: string
  },
  // // Urls to be passed into internal services
  // // for registering the correct callbacks
  applicationUrls: {
    oracle: string,
  },
  participants: Array<Participant>
}

export const ConvictConfig = Convict<GlobalConfig>({
  currency: {
    doc: 'The currency of the switch',
    // TODO: how can we specify the `TCurrency` type here?
    format: String,
    default:'USD',
    env: 'CURRENCY'
  },
  urls: {
    fspiop: {
      doc: 'Switch endpoint for fspiop(Mojaloop) API',
      format: '*',
      env: 'FSPIOP_URL',
      default: '0.0.0.0:4003'
    },
    alsAdmin: {
      doc: 'Switch endpoint for ALS Admin API',
      format: '*',
      env: 'ALS_ADMIN_URL',
      default: '0.0.0.0:4004/account-lookup-service-admin'
    },
    centralLedgerAdmin: {
      doc: 'Switch endpoint for the central-ledger admin API',
      format: '*',
      env: 'CENTRAL_LEDGER_ADMIN_URL',
      default: '0.0.0.0:4004/central-ledger'
    },
  },
  applicationUrls: {
    oracle: {
      doc: 'Switch endpoint for oracle simulator - used to point the ALS to the oracle sim',
      format: '*',
      env: 'ORACLE_URL',
      default: '0.0.0.0:4004/oracle-simulator'
    },
  },
  participants: {
    doc: 'A list of participants (DFSPs, PISPs), with nested parties',
    format: (val: any) => {
      if (!Array.isArray(val)) {
        throw new Error('`participants` must be an array')
      }

      //TODO: other validation!
    },
    default: []
  }
})

export function loadFromFile(filePath: string): GlobalConfig {
  ConvictConfig.loadFile(path.join(__dirname, filePath))
  ConvictConfig.validate({allowed: 'strict'})

  const resolvedConfig: GlobalConfig = {
    currency: ConvictConfig.get('ENV'),
    urls: ConvictConfig.get('urls'),
    applicationUrls: ConvictConfig.get('applicationUrls'),
    participants: ConvictConfig.get('participants'),
  }

  return resolvedConfig
}



// TODO: parse config with convict or something
const baseUrlAdmin = process.env.ELB_URL
const baseUrlFSPIOP = process.env.FSPIOP_URL
const scheme = `http`
const currency = 'USD'

const config: GlobalConfig = {
  currency,
  urls: {
    fspiop: `${scheme}://${baseUrlFSPIOP}`,
    // als: `${scheme}://${baseUrlAdmin}/account-lookup-service`,
    alsAdmin: `${scheme}://${baseUrlAdmin}/account-lookup-service-admin`,
    centralLedgerAdmin: `${scheme}://${baseUrlAdmin}/central-ledger`
  },
  applicationUrls: {
    // TODO: not sure about this one...
    oracle: `${scheme}://${baseUrlAdmin}/oracle-simulator`,
  },
  participants: [
    //disabled for now, enokimm name is too long
    // {
    //   id: 'enokimm',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '26',
    //   // Not sure if this will work...
    //   simulatorAdminUrl: `http://enokimm-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://enokimm-ttk-backend-fspiop.beta.moja-lab.live`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Edwin E",
    //       firstName: "Edwin",
    //       middleName: "E",
    //       lastName: "Enoki",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "555111222"
    //     },
    //     {
    //       displayName: "Eric Elmo",
    //       firstName: "Eric",
    //       middleName: "E",
    //       lastName: "Elmo",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "55512345"
    //     },
    //   ]
    // }, 
    {
      id: 'figmm',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '28',
      // Not sure if this will work...
      simulatorAdminUrl: `http://figmm-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://figmm-ttk-backend-fspiop.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
      ]
    },
    {
      id: 'ppmm',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '48',
      // Not sure if this will work...
      simulatorAdminUrl: `http://ppmm-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://ppmm-ttk-backend-fspiop.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
        {
          displayName: "Edwin E",
          firstName: "Edwin",
          middleName: "E",
          lastName: "Enoki",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "555111222"
        },
        {
          displayName: "Eric Elmo",
          firstName: "Eric",
          middleName: "E",
          lastName: "Elmo",
          dateOfBirth: "1970-01-01",
          idType: "MSISDN",
          idValue: "55512345"
        },
      ]
    },
    {
      id: 'eggmm',
      type: ParticipantType.DFSP,
      // TODO: this is a hack for now, but we actually need to query the admin-api
      // to get this value before setting it :(
      settlementAccountId: '34',
      // Not sure if this will work...
      simulatorAdminUrl: `http://eggmm-backend.beta.moja-lab.live`,
      fspiopCallbackUrl: `http://eggmm-ttk-backend-fspiop.beta.moja-lab.live`,
      thirdpartyCallbackUrl: `n/a`,
      parties: [
      ]
    },
    // {
    //   id: 'applebank',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '18',
    //   simulatorAdminUrl: `http://applebank-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://mojaloop-sim-applebank-scheme-adapter:4000`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Alice Alpaca",
    //       firstName: "Alice",
    //       middleName: "K",
    //       lastName: "Alpaca",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "123456789"
    //     },
    //     {
    //       displayName: "Alex Alligator",
    //       firstName: "Alex",
    //       middleName: "A",
    //       lastName: "Alligator",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "11194979"
    //     },
    //   ]
    // },
    // {
    //   id: 'bananabank',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '20',
    //   // For our demo, Participants are on the same deployment as switch
    //   simulatorAdminUrl: `http://bananabank-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://mojaloop-sim-bananabank-scheme-adapter:4000`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Bob Bobbish",
    //       firstName: "Bob",
    //       middleName: "B",
    //       lastName: "Bobbish",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "218493479"
    //     },
    //     {
    //       displayName: "Belinda Bells",
    //       firstName: "Belinda",
    //       middleName: "B",
    //       lastName: "Bells",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "292455793"
    //     }
    //   ]
    // },
    // {
    //   id: 'carrotmm',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '22',
    //   // For our demo, Participants are on the same deployment as switch
    //   simulatorAdminUrl: `http://carrotmm-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://mojaloop-sim-carrotmm-scheme-adapter:4000`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Cathy C",
    //       firstName: "Cathy",
    //       middleName: "C",
    //       lastName: "Camera",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "32929423"
    //     },
    //     {
    //       displayName: "Colin Creevey",
    //       firstName: "Colin",
    //       middleName: "C",
    //       lastName: "Camera",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "32929124"
    //     }
    //   ]
    // },
    // {
    //   id: 'duriantech',
    //   type: ParticipantType.DFSP,
    //   // TODO: this is a hack for now, but we actually need to query the admin-api
    //   // to get this value before setting it :(
    //   settlementAccountId: '24',
    //   // For our demo, Participants are on the same deployment as switch
    //   simulatorAdminUrl: `http://duriantech-backend.beta.moja-lab.live`,
    //   fspiopCallbackUrl: `http://mojaloop-sim-duriantech-scheme-adapter:4000`,
    //   thirdpartyCallbackUrl: `n/a`,
    //   parties: [
    //     {
    //       displayName: "Dobby Elf",
    //       firstName: "Dobby",
    //       middleName: "E",
    //       lastName: "Elf",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "410283497"
    //     },
    //     {
    //       displayName: "Draco Dragon",
    //       firstName: "Draco",
    //       middleName: "D",
    //       lastName: "Dragon",
    //       dateOfBirth: "1970-01-01",
    //       idType: "MSISDN",
    //       idValue: "4448483173"
    //     }
    //   ]
    // },
  ]
}

export default config
