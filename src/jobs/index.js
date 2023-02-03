import { Agenda } from '@hokify/agenda';

const agenda = new Agenda({
  db: {
    address:
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI
        : process.env.MONGO_URI_TEST,
    collection: 'agendaJobs',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    ensureIndex: true,
    // maxConcurrency: 20,
  },
});

/**
 * CRON JOB
 * @description Check if agenda is working
 */
agenda.define('check_agenda_status', async (job) => {
  console.log('Agenda is working!', job.attrs.data);
});

(async function () {
  const dailyAgendaStatusCheck = await agenda.create('check_agenda_status');

  await agenda.start();

  await dailyAgendaStatusCheck.repeatEvery('0 8 * * 1-7', {
    skipImmediate: true,
    timezone: 'Europe/Rome',
  });

  dailyAgendaStatusCheck.unique({ jobId: 0 });

  await dailyAgendaStatusCheck.save();
})();
