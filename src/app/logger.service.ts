import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  api_url = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  error(error: any): void {
    this.logToServer(this.buildLogMessage(error, LogLevel.Error));
  }

  debug(message: any): void {    
    this.logToServer(this.buildLogMessage(message, LogLevel.Debug));
  }

  info(message: any): void {
    this.logToServer(this.buildLogMessage(message, LogLevel.Info));
  }

  warn(message: any): void {
    this.logToServer(this.buildLogMessage(message, LogLevel.Warn));
  }

  fatal(message: any): void {
    this.logToServer(this.buildLogMessage(message, LogLevel.Fatal));
  }

  private buildLogMessage(message: any, logLevel: LogLevel): string {
    let retMessage = '';
    retMessage += `[${logLevel}]: ` + JSON.stringify(message);
    retMessage += '\t Time: ' + Date.now().toString() + '\n';

    return retMessage;
  }

  private logToServer(message: string) {
    let jsonMessage = {'message': message};
    let post = this.http.post(this.api_url + '/log', jsonMessage).subscribe();
  }
}

export enum LogLevel {
  Debug = 'DEBUG',
  Info = 'INFO',
  Warn = 'WARN',
  Error = 'ERROR',
  Fatal = 'FATAL',
}
